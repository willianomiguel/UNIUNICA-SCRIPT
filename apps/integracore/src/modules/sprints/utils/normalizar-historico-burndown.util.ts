import { type PontoBurndown } from 'src/modules/sprints/types/ponto-burndown';

const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

// Lê o RAW_JSON historicoBurndown (pode vir como texto, nulo ou malformado)
// e devolve só as fotos válidas, ordenadas por data, uma por dia.
export const normalizarHistoricoBurndown = (valor: unknown): PontoBurndown[] => {
  let bruto = valor;

  if (typeof bruto === 'string') {
    try {
      bruto = JSON.parse(bruto);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(bruto)) {
    return [];
  }

  const porData = new Map<string, PontoBurndown>();

  for (const item of bruto) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const { data, pontosRestantes, pontosTotais } = item as Record<
      string,
      unknown
    >;

    if (
      typeof data !== 'string' ||
      !DATA_ISO.test(data) ||
      typeof pontosRestantes !== 'number' ||
      !Number.isFinite(pontosRestantes)
    ) {
      continue;
    }

    porData.set(data, {
      data,
      pontosRestantes,
      pontosTotais:
        typeof pontosTotais === 'number' && Number.isFinite(pontosTotais)
          ? pontosTotais
          : pontosRestantes,
    });
  }

  return [...porData.values()].sort((a, b) => a.data.localeCompare(b.data));
};
