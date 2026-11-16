import { CORES_QUADRO } from 'src/modules/quadros/constants/cores-quadro.constant';
import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';
import { type ResultadoValidacao } from 'src/modules/quadros/types/resultado-validacao';

const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const ehObjetoQuadro = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null && !Array.isArray(valor);

export const listaDeCoresPermitidas = (): string => CORES_QUADRO.map((cor) => cor.valor).join(', ');

export const validarQuadroId = (valor: unknown): ResultadoValidacao<string> => {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return { ok: false, erro: 'Informe o quadroId (id do quadro). Use find_many_quadros para descobrir.' };
  }

  const id = valor.trim();

  if (!REGEX_UUID.test(id)) {
    return { ok: false, erro: `quadroId inválido: "${id.slice(0, 80)}". Deve ser o UUID do quadro.` };
  }

  return { ok: true, valor: id };
};

export const validarCorOpcional = (valor: unknown, onde: string): ResultadoValidacao<CorQuadro | undefined> => {
  if (valor === undefined || valor === null) {
    return { ok: true, valor: undefined };
  }

  const permitida = CORES_QUADRO.find((cor) => cor.valor === valor);

  if (!permitida) {
    return {
      ok: false,
      erro: `Cor inválida em ${onde}: ${String(JSON.stringify(valor)).slice(0, 80)}. Cores permitidas: ${listaDeCoresPermitidas()}.`,
    };
  }

  return { ok: true, valor: permitida.valor };
};

export const validarTextoOpcional = (valor: unknown, onde: string): ResultadoValidacao<string | undefined> => {
  if (valor === undefined || valor === null) {
    return { ok: true, valor: undefined };
  }

  if (typeof valor !== 'string') {
    return { ok: false, erro: `O texto de ${onde} deve ser uma string.` };
  }

  if (valor.length > LIMITES_QUADRO.textoMaximo) {
    return {
      ok: false,
      erro: `O texto de ${onde} tem ${valor.length} caracteres; o máximo é ${LIMITES_QUADRO.textoMaximo}. Resuma o texto.`,
    };
  }

  return { ok: true, valor };
};
