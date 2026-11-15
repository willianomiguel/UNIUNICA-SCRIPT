// Formata o valor de uma meta conforme a unidade (REAIS, PERCENTUAL, QUANTIDADE).
export const formatarValorMeta = (valor: number | null, unidade: string): string => {
  if (valor === null) {
    return '—';
  }

  if (unidade === 'REAIS') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }

  const numero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(valor);

  return unidade === 'PERCENTUAL' ? `${numero}%` : numero;
};
