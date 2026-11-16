// Formats a 0..1 fraction as a pt-BR percentage with one decimal ("12,5%").
export const formatarPercentual = (fracao: number): string =>
  `${(Math.round(fracao * 1000) / 10).toFixed(1).replace('.', ',')}%`;
