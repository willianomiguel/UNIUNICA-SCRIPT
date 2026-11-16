// Dias corridos de hoje até dataFim (inclusive o dia final); negativo se já passou.
export const calcularDiasRestantes = (dataFim: string | null, hoje: string): number | null => {
  if (!dataFim) {
    return null;
  }

  const fim = Date.parse(dataFim.slice(0, 10));
  const agora = Date.parse(hoje.slice(0, 10));

  if (Number.isNaN(fim) || Number.isNaN(agora)) {
    return null;
  }

  return Math.round((fim - agora) / 86_400_000);
};
