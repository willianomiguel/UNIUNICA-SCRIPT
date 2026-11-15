// Data "AAAA-MM-DD" de um instante no fuso indicado (padrão: horário de Brasília).
export const dataNoFuso = (
  instante: Date,
  fusoHorario = 'America/Sao_Paulo',
): string => {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: fusoHorario,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instante);

  const parte = (tipo: string) =>
    partes.find((item) => item.type === tipo)?.value ?? '';

  return `${parte('year')}-${parte('month')}-${parte('day')}`;
};
