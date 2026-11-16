import { LIMITES_ASSISTENTE } from 'src/modules/assistente/constants/assistente-limites';
import { type ResultadoValidacao } from 'src/modules/assistente/types/resultado-validacao';

const STATUS_META = ['NO_PRAZO', 'EM_RISCO', 'ATRASADA', 'CONCLUIDA'];

export const validarEntradaMetas = (
  entrada: unknown,
): ResultadoValidacao<{ status: string | null; busca: string | null }> => {
  const objeto = entrada === undefined || entrada === null ? {} : entrada;

  if (typeof objeto !== 'object' || Array.isArray(objeto)) {
    return { ok: false, erro: 'Entrada inválida: envie um objeto (ou nada) com status e busca opcionais.' };
  }

  const { status, busca } = objeto as Record<string, unknown>;
  const statusFinal = status === undefined || status === null || status === '' ? null : status;

  if (statusFinal !== null && (typeof statusFinal !== 'string' || !STATUS_META.includes(statusFinal))) {
    return { ok: false, erro: `Status inválido: use ${STATUS_META.join(', ')}.` };
  }

  if (busca !== undefined && busca !== null && typeof busca !== 'string') {
    return { ok: false, erro: '"busca" deve ser um texto.' };
  }

  const buscaFinal = typeof busca === 'string' && busca.trim() !== '' ? busca.trim() : null;

  if (buscaFinal !== null && buscaFinal.length > LIMITES_ASSISTENTE.buscaMaxima) {
    return { ok: false, erro: `"busca" passou de ${LIMITES_ASSISTENTE.buscaMaxima} caracteres.` };
  }

  return { ok: true, valor: { status: statusFinal, busca: buscaFinal } };
};
