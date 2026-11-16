// Divide e devolve null quando o denominador é zero, negativo ou inválido.
export const dividirSeguro = (
  numerador: number,
  denominador: number,
): number | null => {
  if (!Number.isFinite(numerador) || !Number.isFinite(denominador)) {
    return null;
  }

  if (denominador <= 0) {
    return null;
  }

  return numerador / denominador;
};
