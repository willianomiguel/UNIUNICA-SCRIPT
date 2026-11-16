export const formatarNumero = (
  valor: number | null | undefined,
  casasDecimais = 0,
): string =>
  valor === null || valor === undefined || !Number.isFinite(valor)
    ? '—'
    : new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: casasDecimais,
        maximumFractionDigits: casasDecimais,
      }).format(valor);
