// Data de hoje (AAAA-MM-DD) no fuso de São Paulo.
export const dataHojeIso = (
  agora: Date = new Date(),
  fusoHorario = 'America/Sao_Paulo',
): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: fusoHorario,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(agora);
