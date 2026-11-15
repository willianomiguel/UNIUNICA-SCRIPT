import { type GatewayPagamento } from 'src/modules/vendas/types/gateway-pagamento';

const MAPA: Record<string, GatewayPagamento> = {
  stripe: 'STRIPE',
  mercado_pago: 'MERCADO_PAGO',
  mercadopago: 'MERCADO_PAGO',
  asaas: 'ASAAS',
  pagarme: 'PAGARME',
  'pagar.me': 'PAGARME',
  manual: 'MANUAL',
  outro: 'OUTRO',
};

export const normalizarGateway = (
  valor: string | null,
  padrao: GatewayPagamento,
): GatewayPagamento =>
  valor === null
    ? padrao
    : (MAPA[valor.trim().toLowerCase().replace(/[\s-]/g, '_')] ?? 'OUTRO');
