// Campos da venda (módulo vendas) usados pelo financeiro.
export type VendaResumo = {
  id: string;
  status: string | null;
  descricao: string | null;
  valor: number | null;
  valorLiquido: number | null;
  dataEvento: string | null;
};
