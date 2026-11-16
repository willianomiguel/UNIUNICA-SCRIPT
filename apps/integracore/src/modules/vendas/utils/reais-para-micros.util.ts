// Rounds to whole cents first so floating-point noise never reaches the stored amount.
export const reaisParaMicros = (reais: number): number =>
  Math.round(reais * 100) * 10_000;
