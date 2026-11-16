// Campos CURRENCY do IntegraCore guardam amountMicros (1 real = 1.000.000 micros).
export const microsParaReais = (micros: number | string | null | undefined): number => {
  if (micros === null || micros === undefined || micros === '') {
    return 0;
  }

  const valor = Number(micros);

  return Number.isFinite(valor) ? valor / 1_000_000 : 0;
};
