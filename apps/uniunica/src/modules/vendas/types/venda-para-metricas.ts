import { type GatewayPagamento } from 'src/modules/vendas/types/gateway-pagamento';
import { type MetodoPagamento } from 'src/modules/vendas/types/metodo-pagamento';
import { type VendaStatus } from 'src/modules/vendas/types/venda-status';

// Amounts in reais.
export type VendaParaMetricas = {
  status: VendaStatus | null;
  gateway: GatewayPagamento | null;
  metodoPagamento: MetodoPagamento | null;
  valor: number;
  valorLiquido: number | null;
  taxaGateway: number | null;
  dataEvento: string | null;
};
