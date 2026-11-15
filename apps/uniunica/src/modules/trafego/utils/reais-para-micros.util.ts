export const reaisParaMicros = (reais: number): number =>
  Number.isFinite(reais) ? Math.round(reais * 100) * 10_000 : 0;
