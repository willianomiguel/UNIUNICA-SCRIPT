export const countVendasAprovadas = (vendas: Array<{ status?: unknown }>): number =>
  vendas.filter((venda) => venda.status === 'APROVADA').length;
