export const centavosParaReais = (
  centavos: number | string | null | undefined,
): number | null => {
  if (centavos === null || centavos === undefined || centavos === '') {
    return null;
  }

  const valor = Number(centavos);

  return Number.isFinite(valor) ? Math.round(valor) / 100 : null;
};
