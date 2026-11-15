export const reaisParaMicros = (reais: number): number =>
  Math.round(reais * 100) * 10_000;
