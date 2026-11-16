const DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})/;

// Converte 'AAAA-MM-DD' (ou um ISO que comece assim) em ms UTC à meia-noite.
// Ignora fuso horário de propósito: campos DATE do IntegraCore não têm hora.
export const parseDateOnly = (value: string | null | undefined): number | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const match = DATE_PREFIX.exec(value.trim());

  if (match === null) {
    return null;
  }

  const [, year, month, day] = match;
  const ms = Date.UTC(Number(year), Number(month) - 1, Number(day));
  const date = new Date(ms);

  // Rejeita datas impossíveis como 2026-02-31.
  if (date.getUTCMonth() !== Number(month) - 1 || date.getUTCDate() !== Number(day)) {
    return null;
  }

  return ms;
};
