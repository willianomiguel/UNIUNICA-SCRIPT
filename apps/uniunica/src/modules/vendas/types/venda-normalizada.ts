import { type GatewayPagamento } from 'src/modules/vendas/types/gateway-pagamento';
import { type MetodoPagamento } from 'src/modules/vendas/types/metodo-pagamento';
import { type VendaStatus } from 'src/modules/vendas/types/venda-status';

// Gateway-agnostic sale. Amounts are in reais (decimal), not cents.
export type VendaNormalizada = {
  gateway: GatewayPagamento;
  idExterno: string;
  status: VendaStatus;
  // true when the event legitimately moves a sale back (e.g. a dispute won by the seller)
  forcarStatus?: boolean;
  moeda?: string | null;
  valor?: number | null;
  valorLiquido?: number | null;
  taxaGateway?: number | null;
  descricao?: string | null;
  metodoPagamento?: MetodoPagamento | null;
  parcelas?: number | null;
  clienteNome?: string | null;
  clienteEmail?: string | null;
  dataEvento?: string | null;
  motivoRecusa?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
};
