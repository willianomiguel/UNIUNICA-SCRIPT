type MoedaApi = { amountMicros?: number | string | null; currencyCode?: string | null } | null;

// Subset of a venda record as returned by the Core API.
export type RegistroVendaApi = {
  id: string;
  descricao?: string | null;
  status?: string | null;
  gateway?: string | null;
  metodoPagamento?: string | null;
  valor?: MoedaApi;
  valorLiquido?: MoedaApi;
  taxaGateway?: MoedaApi;
  dataEvento?: string | null;
  clienteNome?: string | null;
  motivoRecusa?: string | null;
};
