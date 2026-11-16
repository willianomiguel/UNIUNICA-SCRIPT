// Corpo de criação de um lançamento na API REST do IntegraCore.
export type LancamentoPayload = {
  descricao: string;
  tipo: string;
  valor: { amountMicros: number; currencyCode: string };
  data: string | null;
  vencimento: string | null;
  status: string;
  recorrencia: string;
  origem: string;
  chaveIdempotencia: string;
  formaPagamento?: string | null;
  centroCusto?: string | null;
  observacoes?: string | null;
  categoriaId?: string | null;
  vendaId?: string | null;
  recorrenciaRaizId?: string | null;
};
