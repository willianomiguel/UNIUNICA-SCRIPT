export const microsParaReais = (
  amountMicros: number | string | null | undefined,
): number | null => {
  if (amountMicros === null || amountMicros === undefined || amountMicros === '') {
    return null;
  }

  const micros = Number(amountMicros);

  return Number.isFinite(micros) ? Math.round(micros / 10_000) / 100 : null;
};
