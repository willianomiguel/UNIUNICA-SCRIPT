import { type GatewayPagamento } from 'src/modules/vendas/types/gateway-pagamento';
import { type MetodoPagamento } from 'src/modules/vendas/types/metodo-pagamento';
import { type VendaStatus } from 'src/modules/vendas/types/venda-status';

type Moeda = { amountMicros: number; currencyCode: string };

// Shape written to the venda object through the Core API.
export type DadosVendaRegistro = {
  gateway: GatewayPagamento;
  idExterno: string;
  status?: VendaStatus;
  descricao?: string;
  valor?: Moeda;
  valorLiquido?: Moeda;
  taxaGateway?: Moeda;
  metodoPagamento?: MetodoPagamento;
  parcelas?: number;
  clienteNome?: string;
  clienteEmail?: { primaryEmail: string; additionalEmails: string[] | null };
  dataEvento?: string;
  motivoRecusa?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};
