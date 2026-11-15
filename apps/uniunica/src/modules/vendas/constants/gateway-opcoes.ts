import { type GatewayPagamento } from 'src/modules/vendas/types/gateway-pagamento';
import { type OpcaoSelect } from 'src/modules/vendas/types/opcao-select';

export const GATEWAY_OPCOES: OpcaoSelect<GatewayPagamento>[] = [
  { value: 'STRIPE', label: 'Stripe', color: 'purple', position: 0 },
  { value: 'MERCADO_PAGO', label: 'Mercado Pago', color: 'sky', position: 1 },
  { value: 'ASAAS', label: 'Asaas', color: 'blue', position: 2 },
  { value: 'PAGARME', label: 'Pagar.me', color: 'green', position: 3 },
  { value: 'MANUAL', label: 'Manual', color: 'gray', position: 4 },
  { value: 'OUTRO', label: 'Outro', color: 'turquoise', position: 5 },
];
