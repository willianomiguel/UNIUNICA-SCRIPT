import { type Recorrencia } from 'src/modules/financeiro/types/recorrencia';

const MESES_POR_RECORRENCIA: Partial<Record<Recorrencia, number>> = {
  MENSAL: 1,
  TRIMESTRAL: 3,
  ANUAL: 12,
};

const formatarData = (data: Date): string => data.toISOString().slice(0, 10);

// Próxima data (YYYY-MM-DD) de uma série. `diaAncora` mantém o dia original
// (ex.: 31) para que 31/01 → 28/02 → 31/03, sem "escorregar" para o dia 28.
export const calcularProximaRecorrencia = (
  data: string,
  recorrencia: Recorrencia,
  diaAncora?: number,
): string | null => {
  if (!/^\d{4}-\d{2}-\d{2}/.test(data)) {
    return null;
  }

  const [ano, mes, dia] = data.slice(0, 10).split('-').map(Number);

  if (recorrencia === 'SEMANAL') {
    return formatarData(new Date(Date.UTC(ano, mes - 1, dia + 7)));
  }

  const meses = MESES_POR_RECORRENCIA[recorrencia];

  if (meses === undefined) {
    return null;
  }

  const diaDesejado = diaAncora ?? dia;
  const ultimoDiaDoMesAlvo = new Date(
    Date.UTC(ano, mes - 1 + meses + 1, 0),
  ).getUTCDate();

  return formatarData(
    new Date(
      Date.UTC(ano, mes - 1 + meses, Math.min(diaDesejado, ultimoDiaDoMesAlvo)),
    ),
  );
};
