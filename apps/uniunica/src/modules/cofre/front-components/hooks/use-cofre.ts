import { useCallback, useEffect, useRef, useState } from 'react';
import { RestApiClient } from 'twenty-client-sdk/rest';

import { COFRE_TRAVA_AUTOMATICA_MS } from 'src/modules/cofre/constants/cripto-cofre.constant';
import { ConflitoCofreError, gravarCofre, lerCofre, type RegistroCofre } from 'src/modules/cofre/data/registro-cofre';
import { type ChaveCofre } from 'src/modules/cofre/types/chave-cofre';
import { type ConteudoCofre } from 'src/modules/cofre/types/conteudo-cofre';
import {
  abrirCofre,
  cifrarConteudoCofre,
  criarChaveCofre,
  SenhaCofreIncorretaError,
} from 'src/modules/cofre/utils/cripto-cofre.util';

export type EstadoCofre =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  // esvaziado: o registro já foi alterado e o conteúdo sumiu (alguém apagou o bloco); não é um cofre novo.
  | { tipo: 'novo'; registro: RegistroCofre; esvaziado: boolean }
  | { tipo: 'travado'; registro: RegistroCofre }
  | { tipo: 'aberto'; registro: RegistroCofre; conteudo: ConteudoCofre };

const INTERVALO_CHECAGEM_TRAVA_MS = 15_000;

const mensagemDe = (erro: unknown) => (erro instanceof Error ? erro.message : String(erro));

// Guarda a chave só em memória (ref), nunca em storage. Travar = esquecer chave e conteúdo.
export const useCofre = (recordId: string | null) => {
  const [estado, setEstado] = useState<EstadoCofre>({ tipo: 'carregando' });
  const [ocupado, setOcupado] = useState(false);
  const chaveRef = useRef<ChaveCofre | null>(null);
  const ultimaAtividadeRef = useRef(Date.now());
  const clienteRef = useRef<RestApiClient | null>(null);

  const cliente = () => {
    clienteRef.current ??= new RestApiClient();

    return clienteRef.current;
  };

  const esquecerChave = () => {
    chaveRef.current?.chave.fill(0);
    chaveRef.current = null;
  };

  const carregar = useCallback(async () => {
    if (!recordId) {
      return;
    }

    esquecerChave();
    setEstado({ tipo: 'carregando' });

    try {
      const registro = await lerCofre(cliente(), recordId);

      setEstado(
        registro.conteudoCifrado === null
          ? { tipo: 'novo', registro, esvaziado: registro.updatedAt !== registro.createdAt }
          : { tipo: 'travado', registro },
      );
    } catch (erro) {
      setEstado({ tipo: 'erro', mensagem: mensagemDe(erro) });
    }
  }, [recordId]);

  useEffect(() => {
    void carregar();

    return esquecerChave;
  }, [carregar]);

  const travar = useCallback(() => {
    esquecerChave();
    setEstado((atual) => (atual.tipo === 'aberto' ? { tipo: 'travado', registro: atual.registro } : atual));
  }, []);

  const registrarAtividade = useCallback(() => {
    ultimaAtividadeRef.current = Date.now();
  }, []);

  // Trava sozinho depois de um tempo parado.
  useEffect(() => {
    if (estado.tipo !== 'aberto') {
      return;
    }

    const intervalo = setInterval(() => {
      if (Date.now() - ultimaAtividadeRef.current > COFRE_TRAVA_AUTOMATICA_MS) {
        travar();
      }
    }, INTERVALO_CHECAGEM_TRAVA_MS);

    return () => clearInterval(intervalo);
  }, [estado.tipo, travar]);

  const abrir = useCallback(
    async (senha: string): Promise<string | null> => {
      if (estado.tipo !== 'travado' || estado.registro.conteudoCifrado === null) {
        return null;
      }

      setOcupado(true);

      try {
        const { chave, conteudo } = await abrirCofre(estado.registro.conteudoCifrado, senha, estado.registro.id);

        chaveRef.current = chave;
        ultimaAtividadeRef.current = Date.now();
        setEstado({ tipo: 'aberto', registro: estado.registro, conteudo });

        return null;
      } catch (erro) {
        return erro instanceof SenhaCofreIncorretaError ? 'Senha incorreta.' : mensagemDe(erro);
      } finally {
        setOcupado(false);
      }
    },
    [estado],
  );

  const gravarComChave = async (
    registro: RegistroCofre,
    conteudo: ConteudoCofre,
    chave: ChaveCofre,
  ): Promise<string | null> => {
    try {
      const salvo = await gravarCofre(
        cliente(),
        registro.id,
        cifrarConteudoCofre(conteudo, chave, registro.id),
        registro.updatedAt,
      );

      if (chaveRef.current !== chave) {
        esquecerChave();
      }

      chaveRef.current = chave;
      setEstado({ tipo: 'aberto', registro: salvo, conteudo });

      return null;
    } catch (erro) {
      if (erro instanceof ConflitoCofreError) {
        await carregar();
      }

      return mensagemDe(erro);
    }
  };

  // Cofre novo: define a senha e grava o primeiro bloco (vazio).
  const criar = useCallback(
    async (senha: string): Promise<string | null> => {
      if (estado.tipo !== 'novo') {
        return null;
      }

      setOcupado(true);

      try {
        return await gravarComChave(estado.registro, { versao: 1, itens: [] }, await criarChaveCofre(senha));
      } finally {
        setOcupado(false);
      }
    },
    [estado],
  );

  const salvar = useCallback(
    async (conteudo: ConteudoCofre): Promise<string | null> => {
      const chave = chaveRef.current;

      if (estado.tipo !== 'aberto' || chave === null) {
        return 'O cofre travou. Abra de novo.';
      }

      setOcupado(true);
      ultimaAtividadeRef.current = Date.now();

      try {
        return await gravarComChave(estado.registro, conteudo, chave);
      } finally {
        setOcupado(false);
      }
    },
    [estado],
  );

  // Troca de senha: confere a atual, gera sal novo e regrava tudo.
  const trocarSenha = useCallback(
    async (senhaAtual: string, senhaNova: string): Promise<string | null> => {
      if (estado.tipo !== 'aberto') {
        return 'O cofre travou. Abra de novo.';
      }

      setOcupado(true);

      try {
        const atual = await lerCofre(cliente(), estado.registro.id);

        if (atual.conteudoCifrado === null || atual.updatedAt !== estado.registro.updatedAt) {
          await carregar();

          return new ConflitoCofreError().message;
        }

        try {
          (await abrirCofre(atual.conteudoCifrado, senhaAtual, atual.id)).chave.chave.fill(0);
        } catch (erro) {
          return erro instanceof SenhaCofreIncorretaError ? 'A senha atual está incorreta.' : mensagemDe(erro);
        }

        const chaveNova = await criarChaveCofre(senhaNova);
        const resultado = await gravarComChave(estado.registro, estado.conteudo, chaveNova);

        return resultado;
      } finally {
        setOcupado(false);
      }
    },
    [estado],
  );

  return { estado, ocupado, carregar, abrir, criar, salvar, trocarSenha, travar, registrarAtividade };
};
