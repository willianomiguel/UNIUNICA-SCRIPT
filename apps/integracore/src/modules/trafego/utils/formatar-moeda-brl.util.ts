export const formatarMoedaBrl = (valor: number | null | undefined): string =>
  valor === null || valor === undefined || !Number.isFinite(valor)
    ? '—'
    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
