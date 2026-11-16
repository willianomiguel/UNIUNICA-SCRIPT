import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { bytesToHex, bytesToUtf8, hexToBytes, randomBytes, utf8ToBytes } from '@noble/ciphers/utils.js';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';

import { CRIPTO_COFRE } from 'src/modules/cofre/constants/cripto-cofre.constant';
import { type BlocoCifrado } from 'src/modules/cofre/types/bloco-cifrado';
import { type ChaveCofre } from 'src/modules/cofre/types/chave-cofre';
import { type ConteudoCofre } from 'src/modules/cofre/types/conteudo-cofre';
import { normalizarConteudoCofre } from 'src/modules/cofre/utils/normalizar-conteudo-cofre.util';

// Derivação acima disso trava a aba: bloco adulterado não pode forçar isso.
const ITERACOES_MAXIMAS = 5_000_000;

export class SenhaCofreIncorretaError extends Error {
  constructor() {
    super('Senha do cofre incorreta.');
    this.name = 'SenhaCofreIncorretaError';
  }
}

export class BlocoCofreInvalidoError extends Error {
  constructor(motivo: string) {
    super(`Conteúdo do cofre inválido: ${motivo}`);
    this.name = 'BlocoCofreInvalidoError';
  }
}

const HEX = /^[0-9a-f]*$/;

const ehHex = (valor: unknown, bytes?: number): valor is string =>
  typeof valor === 'string' &&
  valor.length % 2 === 0 &&
  HEX.test(valor) &&
  (bytes === undefined || valor.length === bytes * 2);

// O registro do cofre é amarrado ao bloco: copiar o bloco de um cofre para outro falha na autenticação.
const dadosAssociados = (cofreId: string) => utf8ToBytes(`integracore-cofre:${cofreId}`);

export const lerBlocoCifrado = (texto: string): BlocoCifrado => {
  let bruto: unknown;

  try {
    bruto = JSON.parse(texto);
  } catch {
    throw new BlocoCofreInvalidoError('não é JSON');
  }

  const bloco = bruto as Partial<BlocoCifrado> | null;

  if (!bloco || typeof bloco !== 'object' || bloco.v !== 1) {
    throw new BlocoCofreInvalidoError('versão desconhecida');
  }

  if (bloco.kdf !== 'pbkdf2-sha256' || bloco.cifra !== 'xchacha20poly1305') {
    throw new BlocoCofreInvalidoError('algoritmo desconhecido');
  }

  if (
    typeof bloco.iteracoes !== 'number' ||
    !Number.isInteger(bloco.iteracoes) ||
    bloco.iteracoes < CRIPTO_COFRE.ITERACOES_MINIMAS ||
    bloco.iteracoes > ITERACOES_MAXIMAS
  ) {
    throw new BlocoCofreInvalidoError('parâmetro de derivação fora do permitido');
  }

  if (
    !ehHex(bloco.sal, CRIPTO_COFRE.BYTES_SAL) ||
    !ehHex(bloco.nonce, CRIPTO_COFRE.BYTES_NONCE) ||
    !ehHex(bloco.dados) ||
    bloco.dados.length < CRIPTO_COFRE.BYTES_TAG * 2
  ) {
    throw new BlocoCofreInvalidoError('campos corrompidos');
  }

  return bloco as BlocoCifrado;
};

export const derivarChaveCofre = async (
  senha: string,
  sal: string,
  iteracoes: number,
): Promise<ChaveCofre> => {
  const chave = await pbkdf2Async(sha256, utf8ToBytes(senha.normalize('NFC')), hexToBytes(sal), {
    c: iteracoes,
    dkLen: CRIPTO_COFRE.BYTES_CHAVE,
  });

  return { chave, sal, iteracoes };
};

// Chave nova (sal aleatório) para cofre novo ou troca de senha.
export const criarChaveCofre = (
  senha: string,
  iteracoes: number = CRIPTO_COFRE.ITERACOES_PADRAO,
): Promise<ChaveCofre> => derivarChaveCofre(senha, bytesToHex(randomBytes(CRIPTO_COFRE.BYTES_SAL)), iteracoes);

// Cada gravação usa nonce novo (24 bytes aleatórios: sem risco prático de repetição).
export const cifrarConteudoCofre = (conteudo: ConteudoCofre, chave: ChaveCofre, cofreId: string): string => {
  const nonce = randomBytes(CRIPTO_COFRE.BYTES_NONCE);
  const dados = xchacha20poly1305(chave.chave, nonce, dadosAssociados(cofreId)).encrypt(
    utf8ToBytes(JSON.stringify(conteudo)),
  );

  const bloco: BlocoCifrado = {
    v: 1,
    kdf: 'pbkdf2-sha256',
    iteracoes: chave.iteracoes,
    sal: chave.sal,
    cifra: 'xchacha20poly1305',
    nonce: bytesToHex(nonce),
    dados: bytesToHex(dados),
  };

  return JSON.stringify(bloco);
};

export const decifrarComChave = (bloco: BlocoCifrado, chave: ChaveCofre, cofreId: string): ConteudoCofre => {
  let claro: Uint8Array;

  try {
    claro = xchacha20poly1305(chave.chave, hexToBytes(bloco.nonce), dadosAssociados(cofreId)).decrypt(
      hexToBytes(bloco.dados),
    );
  } catch {
    // Falha de autenticação: senha errada ou bloco adulterado. Não dá para distinguir (e não deve).
    throw new SenhaCofreIncorretaError();
  }

  try {
    return normalizarConteudoCofre(JSON.parse(bytesToUtf8(claro)));
  } catch {
    throw new BlocoCofreInvalidoError('conteúdo decifrado ilegível');
  }
};

// Abre o cofre com a senha: devolve a chave (para gravar depois) e o conteúdo.
export const abrirCofre = async (
  texto: string,
  senha: string,
  cofreId: string,
): Promise<{ chave: ChaveCofre; conteudo: ConteudoCofre }> => {
  const bloco = lerBlocoCifrado(texto);
  const chave = await derivarChaveCofre(senha, bloco.sal, bloco.iteracoes);

  try {
    return { chave, conteudo: decifrarComChave(bloco, chave, cofreId) };
  } catch (erro) {
    chave.chave.fill(0);
    throw erro;
  }
};
