import { ehObjetoJson } from 'src/modules/vendas/utils/eh-objeto-json.util';

// Accepts one event, a JSON array, or { "vendas": [...] } / { "eventos": [...] }.
export const extrairItensLote = (corpo: unknown): unknown[] => {
  if (Array.isArray(corpo)) {
    return corpo;
  }

  if (ehObjetoJson(corpo)) {
    if (Array.isArray(corpo.vendas)) {
      return corpo.vendas;
    }

    if (Array.isArray(corpo.eventos)) {
      return corpo.eventos;
    }

    return [corpo];
  }

  return [];
};
