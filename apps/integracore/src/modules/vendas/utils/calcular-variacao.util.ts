// Relative change as a fraction; null when there is no previous value to compare with.
export const calcularVariacao = (atual: number, anterior: number): number | null =>
  anterior === 0 ? null : (atual - anterior) / Math.abs(anterior);
