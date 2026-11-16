// Corpo de criação de um lançamento feito pelo assistente (API REST do Twenty).
export type LancamentoAssistentePayload = {
  descricao: string;
  tipo: string;
  valor: { amountMicros: number; currencyCode: string };
  data: string;
  vencimento: string;
  status: string;
  recorrencia: string;
  origem: string;
  formaPagamento: string | null;
  observacoes: string | null;
  categoriaId: string | null;
};
