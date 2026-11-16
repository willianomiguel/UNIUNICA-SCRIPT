import { describe, expect, it } from 'vitest';

import { CRIPTO_COFRE } from 'src/modules/cofre/constants/cripto-cofre.constant';
import { type ConteudoCofre } from 'src/modules/cofre/types/conteudo-cofre';
import {
  abrirCofre,
  BlocoCofreInvalidoError,
  cifrarConteudoCofre,
  criarChaveCofre,
  lerBlocoCifrado,
  SenhaCofreIncorretaError,
} from 'src/modules/cofre/utils/cripto-cofre.util';

// Mínimo permitido para o teste não demorar; a produção usa 600 mil.
const ITER = CRIPTO_COFRE.ITERACOES_MINIMAS;
const SENHA = 'senha-forte-do-cofre';
const COFRE_ID = '11111111-1111-4111-8111-111111111111';

const conteudo: ConteudoCofre = {
  versao: 1,
  itens: [
    {
      id: 'a',
      nome: 'VM Produção',
      endereco: '10.0.0.5',
      usuario: 'root',
      senha: 'S3gr3d0!çã',
      observacoes: 'porta 2222',
      atualizadoEm: '2026-11-15T10:00:00.000Z',
    },
  ],
};

describe('cripto do cofre', () => {
  it('cifra e abre com a mesma senha', async () => {
    const chave = await criarChaveCofre(SENHA, ITER);
    const bloco = cifrarConteudoCofre(conteudo, chave, COFRE_ID);

    const aberto = await abrirCofre(bloco, SENHA, COFRE_ID);

    expect(aberto.conteudo).toEqual(conteudo);
  });

  it('não deixa nenhum dado em claro no bloco gravado', async () => {
    const chave = await criarChaveCofre(SENHA, ITER);
    const bloco = cifrarConteudoCofre(conteudo, chave, COFRE_ID);

    for (const segredo of ['VM Produção', '10.0.0.5', 'root', 'S3gr3d0', 'porta 2222', SENHA]) {
      expect(bloco).not.toContain(segredo);
    }
  });

  it('recusa senha errada', async () => {
    const chave = await criarChaveCofre(SENHA, ITER);
    const bloco = cifrarConteudoCofre(conteudo, chave, COFRE_ID);

    await expect(abrirCofre(bloco, 'outra-senha-qualquer', COFRE_ID)).rejects.toBeInstanceOf(
      SenhaCofreIncorretaError,
    );
  });

  it('recusa bloco copiado de outro cofre', async () => {
    const chave = await criarChaveCofre(SENHA, ITER);
    const bloco = cifrarConteudoCofre(conteudo, chave, COFRE_ID);

    await expect(
      abrirCofre(bloco, SENHA, '22222222-2222-4222-8222-222222222222'),
    ).rejects.toBeInstanceOf(SenhaCofreIncorretaError);
  });

  it('recusa bloco adulterado', async () => {
    const chave = await criarChaveCofre(SENHA, ITER);
    const bloco = JSON.parse(cifrarConteudoCofre(conteudo, chave, COFRE_ID));
    const ultimo = bloco.dados.slice(-2) === '00' ? '01' : '00';
    bloco.dados = bloco.dados.slice(0, -2) + ultimo;

    await expect(abrirCofre(JSON.stringify(bloco), SENHA, COFRE_ID)).rejects.toBeInstanceOf(
      SenhaCofreIncorretaError,
    );
  });

  it('usa nonce novo a cada gravação', async () => {
    const chave = await criarChaveCofre(SENHA, ITER);
    const a = JSON.parse(cifrarConteudoCofre(conteudo, chave, COFRE_ID));
    const b = JSON.parse(cifrarConteudoCofre(conteudo, chave, COFRE_ID));

    expect(a.nonce).not.toBe(b.nonce);
    expect(a.dados).not.toBe(b.dados);
  });

  it('usa sal novo a cada chave criada', async () => {
    const a = await criarChaveCofre(SENHA, ITER);
    const b = await criarChaveCofre(SENHA, ITER);

    expect(a.sal).not.toBe(b.sal);
  });

  it('grava as 600 mil rodadas por padrão no bloco', () => {
    expect(CRIPTO_COFRE.ITERACOES_PADRAO).toBeGreaterThanOrEqual(600_000);
  });

  it('recusa bloco com derivação fraca ou exagerada', () => {
    const base = {
      v: 1,
      kdf: 'pbkdf2-sha256',
      sal: '00'.repeat(16),
      cifra: 'xchacha20poly1305',
      nonce: '00'.repeat(24),
      dados: '00'.repeat(16),
    };

    expect(() => lerBlocoCifrado(JSON.stringify({ ...base, iteracoes: 1000 }))).toThrow(BlocoCofreInvalidoError);
    expect(() => lerBlocoCifrado(JSON.stringify({ ...base, iteracoes: 1e9 }))).toThrow(BlocoCofreInvalidoError);
    expect(() => lerBlocoCifrado(JSON.stringify({ ...base, iteracoes: 600_000 }))).not.toThrow();
  });

  it('recusa texto que não é bloco', () => {
    expect(() => lerBlocoCifrado('não é json')).toThrow(BlocoCofreInvalidoError);
    expect(() => lerBlocoCifrado('{"v":2}')).toThrow(BlocoCofreInvalidoError);
    expect(() =>
      lerBlocoCifrado(
        JSON.stringify({ v: 1, kdf: 'pbkdf2-sha256', iteracoes: 600_000, sal: 'zz', cifra: 'xchacha20poly1305', nonce: '00', dados: '' }),
      ),
    ).toThrow(BlocoCofreInvalidoError);
  });
});
