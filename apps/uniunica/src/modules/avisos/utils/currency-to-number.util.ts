// CURRENCY do Twenty: { amountMicros, currencyCode }. amountMicros pode vir como string.
export const currencyToNumber = (value: unknown): number => {
  if (typeof value !== 'object' || value === null) {
    return 0;
  }

  const amountMicros = Number((value as { amountMicros?: unknown }).amountMicros);

  return Number.isFinite(amountMicros) ? amountMicros / 1_000_000 : 0;
};
