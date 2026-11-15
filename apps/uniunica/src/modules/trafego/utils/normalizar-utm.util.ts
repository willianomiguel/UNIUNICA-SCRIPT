// Normaliza utm_campaign para comparação: minúsculas, sem espaços nas pontas, sem acentos.
export const normalizarUtm = (valor: unknown): string | null => {
  if (typeof valor !== 'string') {
    return null;
  }

  const texto = valor
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

  return texto === '' ? null : texto;
};
