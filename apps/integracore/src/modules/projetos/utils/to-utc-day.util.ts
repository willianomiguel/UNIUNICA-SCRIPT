// Meia-noite UTC do dia local de `date` (usado para "hoje" no Roadmap).
export const toUtcDay = (date: Date): number =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
