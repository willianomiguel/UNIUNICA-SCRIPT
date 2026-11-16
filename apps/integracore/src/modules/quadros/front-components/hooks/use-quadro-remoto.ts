import { useCallback, useEffect, useRef, useState } from 'react';
import { RestApiClient } from 'integra-client-sdk/rest';
import { enqueueSnackbar } from 'integra-sdk/front-component';

import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { type CameraQuadro } from 'src/modules/quadros/types/camera-quadro';
import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { decidirSincronizacaoQuadro } from 'src/modules/quadros/utils/decidir-sincronizacao-quadro.util';
import { normalizarConteudoQuadro } from 'src/modules/quadros/utils/normalizar-conteudo-quadro.util';

const ESPERA_SALVAR_MS = 800;
const INTERVALO_CHECAGEM_MS = 4000;

export type StatusSalvamento = 'salvo' | 'pendente' | 'salvando' | 'erro';

type RegistroQuadro = { id: string; nome: string; conteudo: ConteudoQuadro; updatedAt: string | null };

export type EstadoCarregamento =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'pronto'; registro: RegistroQuadro };

const extrairRegistro = (resposta: unknown): Record<string, unknown> | null => {
  const data = (resposta as { data?: Record<string, unknown> } | null)?.data;

  if (!data || typeof data !== 'object') {
    return null;
  }

  const registro = Object.values(data)[0];

  return registro && typeof registro === 'object' ? (registro as Record<string, unknown>) : null;
};

const lerRegistro = async (cliente: RestApiClient, id: string): Promise<RegistroQuadro | null> => {
  const bruto = extrairRegistro(await cliente.get(`/rest/quadros/${id}`, { query: { depth: 0 } }));

  if (bruto === null || typeof bruto.id !== 'string') {
    return null;
  }

  return {
    id: bruto.id,
    nome: typeof bruto.nome === 'string' ? bruto.nome : '',
    conteudo: normalizarConteudoQuadro(bruto.conteudo),
    updatedAt: typeof bruto.updatedAt === 'string' ? bruto.updatedAt : null,
  };
};

// Carrega o quadro, salva com debounce e percebe quando outra pessoa (ou a IA) mudou o registro.
export const useQuadroRemoto = ({
  recordId,
  estaInteragindo,
  aoRecarregar,
}: {
  recordId: string | null;
  estaInteragindo: () => boolean;
  aoRecarregar: (conteudo: ConteudoQuadro) => void;
}) => {
  const [carregamento, setCarregamento] = useState<EstadoCarregamento>({ tipo: 'carregando' });
  const [status, setStatus] = useState<StatusSalvamento>('salvo');
  const [mudancaRemota, setMudancaRemota] = useState(false);

  const clienteRef = useRef<RestApiClient | null>(null);
  const updatedAtRef = useRef<string | null>(null);
  const cameraRef = useRef<CameraQuadro | undefined>(undefined);
  const pendenteRef = useRef<ElementoQuadro[] | null>(null);
  const salvandoRef = useRef(false);
  const statusRef = useRef<StatusSalvamento>('salvo');
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aoRecarregarRef = useRef(aoRecarregar);
  const estaInteragindoRef = useRef(estaInteragindo);

  aoRecarregarRef.current = aoRecarregar;
  estaInteragindoRef.current = estaInteragindo;

  const mudarStatus = (novo: StatusSalvamento) => {
    statusRef.current = novo;
    setStatus(novo);
  };

  const cliente = () => {
    clienteRef.current ??= new RestApiClient();

    return clienteRef.current;
  };

  const carregar = useCallback(async () => {
    if (recordId === null) {
      setCarregamento({ tipo: 'erro', mensagem: 'Abra um quadro para desenhar.' });

      return;
    }

    setCarregamento({ tipo: 'carregando' });
    try {
      const registro = await lerRegistro(cliente(), recordId);

      if (registro === null) {
        setCarregamento({ tipo: 'erro', mensagem: 'Quadro não encontrado.' });

        return;
      }

      updatedAtRef.current = registro.updatedAt;
      cameraRef.current = registro.conteudo.camera;
      pendenteRef.current = null;
      mudarStatus('salvo');
      setMudancaRemota(false);
      setCarregamento({ tipo: 'pronto', registro });
    } catch {
      setCarregamento({ tipo: 'erro', mensagem: 'Verifique a conexão e tente de novo.' });
    }
  }, [recordId]);

  const salvarAgora = useCallback(async () => {
    if (recordId === null || salvandoRef.current || pendenteRef.current === null) {
      return;
    }

    const elementos = pendenteRef.current;
    const conteudo: ConteudoQuadro = {
      versao: 1,
      elementos,
      ...(cameraRef.current ? { camera: cameraRef.current } : {}),
    };

    if (JSON.stringify(conteudo).length > LIMITES_QUADRO.bytesMaximo) {
      mudarStatus('erro');
      void enqueueSnackbar({
        message: 'O quadro passou do tamanho máximo e não foi salvo. Apague alguns desenhos e tente de novo.',
        variant: 'error',
      });

      return;
    }

    salvandoRef.current = true;
    mudarStatus('salvando');
    try {
      const resposta = extrairRegistro(
        await cliente().patch(`/rest/quadros/${recordId}`, { conteudo }),
      );

      if (typeof resposta?.updatedAt === 'string') {
        updatedAtRef.current = resposta.updatedAt;
      }
      if (pendenteRef.current === elementos) {
        pendenteRef.current = null;
        mudarStatus('salvo');
      } else {
        mudarStatus('pendente');
      }
    } catch {
      mudarStatus('erro');
    } finally {
      salvandoRef.current = false;
    }

    // Mudou de novo enquanto salvava: salva a versão mais nova.
    if (pendenteRef.current !== null && statusRef.current === 'pendente') {
      temporizadorRef.current = setTimeout(() => void salvarAgora(), ESPERA_SALVAR_MS);
    }
  }, [recordId]);

  const agendarSalvamento = useCallback(
    (elementos: ElementoQuadro[]) => {
      pendenteRef.current = elementos;
      mudarStatus('pendente');
      if (temporizadorRef.current !== null) {
        clearTimeout(temporizadorRef.current);
      }
      temporizadorRef.current = setTimeout(() => void salvarAgora(), ESPERA_SALVAR_MS);
    },
    [salvarAgora],
  );

  const tentarDeNovo = useCallback(() => {
    if (pendenteRef.current !== null) {
      void salvarAgora();
    }
  }, [salvarAgora]);

  const recarregarDoServidor = useCallback(async () => {
    if (recordId === null) {
      return;
    }

    try {
      const registro = await lerRegistro(cliente(), recordId);

      if (registro === null) {
        return;
      }

      updatedAtRef.current = registro.updatedAt;
      pendenteRef.current = null;
      if (temporizadorRef.current !== null) {
        clearTimeout(temporizadorRef.current);
      }
      mudarStatus('salvo');
      setMudancaRemota(false);
      aoRecarregarRef.current(registro.conteudo);
    } catch {
      setMudancaRemota(true);
      void enqueueSnackbar({ message: 'Não foi possível recarregar o quadro. Tente de novo.', variant: 'error' });
    }
  }, [recordId]);

  // A pessoa prefere a própria versão: esconde o aviso e grava por cima (vale o último a salvar).
  const manterMinhaVersao = useCallback(() => {
    setMudancaRemota(false);
    if (pendenteRef.current !== null) {
      void salvarAgora();
    }
  }, [salvarAgora]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  useEffect(() => {
    if (carregamento.tipo !== 'pronto' || recordId === null) {
      return;
    }

    const intervalo = setInterval(async () => {
      if (salvandoRef.current || estaInteragindoRef.current()) {
        return;
      }

      try {
        const registro = await lerRegistro(cliente(), recordId);

        if (registro === null) {
          return;
        }

        const decisao = decidirSincronizacaoQuadro({
          updatedAtServidor: registro.updatedAt,
          updatedAtConhecido: updatedAtRef.current,
          temEdicaoPendente: pendenteRef.current !== null || salvandoRef.current,
          interagindo: estaInteragindoRef.current(),
        });

        if (decisao === 'recarregar') {
          updatedAtRef.current = registro.updatedAt;
          cameraRef.current = registro.conteudo.camera;
          aoRecarregarRef.current(registro.conteudo);
          void enqueueSnackbar({ message: 'Quadro atualizado com mudanças de outra pessoa ou da IA.', variant: 'info' });
        } else if (decisao === 'avisar') {
          setMudancaRemota(true);
        }
      } catch {
        // Falha de rede na checagem não deve incomodar; tenta de novo no próximo ciclo.
      }
    }, INTERVALO_CHECAGEM_MS);

    return () => clearInterval(intervalo);
  }, [carregamento.tipo, recordId]);

  useEffect(
    () => () => {
      if (temporizadorRef.current !== null) {
        clearTimeout(temporizadorRef.current);
      }
      // Ao sair da página, grava o que ainda estava esperando o debounce.
      if (pendenteRef.current !== null && !salvandoRef.current) {
        void salvarAgora();
      }
    },
    [salvarAgora],
  );

  return {
    carregamento,
    status,
    mudancaRemota,
    carregar,
    agendarSalvamento,
    tentarDeNovo,
    recarregarDoServidor,
    manterMinhaVersao,
  };
};
