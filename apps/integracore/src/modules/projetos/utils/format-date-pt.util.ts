import { parseDateOnly } from 'src/modules/projetos/utils/parse-date-only.util';

const MONTH_LABELS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Data curta em português ('15 nov 2026') a partir de ms UTC ou de 'AAAA-MM-DD'.
export const formatDatePt = (value: number | string | null | undefined): string => {
  const ms = typeof value === 'number' ? value : parseDateOnly(value);

  if (ms === null || !Number.isFinite(ms)) {
    return '—';
  }

  const date = new Date(ms);

  return `${date.getUTCDate()} ${MONTH_LABELS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};
