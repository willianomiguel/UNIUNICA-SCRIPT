// Data de hoje (YYYY-MM-DD) no fuso informado; padrão: horário de Brasília.
export const hojeIso = (
  agora: Date = new Date(),
  timeZone = 'America/Sao_Paulo',
): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(agora);
