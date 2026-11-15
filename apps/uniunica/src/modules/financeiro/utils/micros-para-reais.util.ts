// A API devolve amountMicros como número ou string; null/ inválido vira 0.
export const microsParaReais = (amountMicros: unknown): number => {
  if (amountMicros === null || amountMicros === undefined || amountMicros === '') {
    return 0;
  }

  const micros = Number(amountMicros);

  return Number.isFinite(micros) ? micros / 1_000_000 : 0;
};
