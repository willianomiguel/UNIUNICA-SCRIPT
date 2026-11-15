// Próximo número sequencial, a partir do maior número e do maior código conhecidos.
export const calcularProximoNumeroTarefa = (
  numerosExistentes: Array<number | null | undefined>,
): number => {
  const validos = numerosExistentes.filter(
    (numero): numero is number =>
      typeof numero === 'number' && Number.isFinite(numero) && numero > 0,
  );

  if (validos.length === 0) {
    return 1;
  }

  return Math.floor(Math.max(...validos)) + 1;
};
