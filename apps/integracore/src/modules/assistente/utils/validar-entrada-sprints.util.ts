import { type ResultadoValidacao } from 'src/modules/assistente/types/resultado-validacao';

const PADRAO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const validarEntradaSprints = (entrada: unknown): ResultadoValidacao<{ sprintId: string | null }> => {
  const objeto = entrada === undefined || entrada === null ? {} : entrada;

  if (typeof objeto !== 'object' || Array.isArray(objeto)) {
    return { ok: false, erro: 'Entrada inválida: envie um objeto (ou nada) com sprintId opcional.' };
  }

  const { sprintId } = objeto as Record<string, unknown>;

  if (sprintId === undefined || sprintId === null || sprintId === '') {
    return { ok: true, valor: { sprintId: null } };
  }

  if (typeof sprintId !== 'string' || !PADRAO_UUID.test(sprintId)) {
    return { ok: false, erro: 'sprintId inválido: use o id (UUID) de find_many_sprints.' };
  }

  return { ok: true, valor: { sprintId } };
};
