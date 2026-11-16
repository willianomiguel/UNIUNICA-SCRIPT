import { type FormatoImportacao } from 'src/modules/vendas/types/formato-importacao';
import { type GatewayPagamento } from 'src/modules/vendas/types/gateway-pagamento';
import { type ResultadoNormalizacao } from 'src/modules/vendas/types/resultado-normalizacao';
import { lerObjeto } from 'src/modules/vendas/utils/ler-objeto.util';
import { lerTexto } from 'src/modules/vendas/utils/ler-texto.util';
import { normalizarEventoAsaas } from 'src/modules/vendas/utils/normalizar-evento-asaas.util';
import { normalizarEventoPagarme } from 'src/modules/vendas/utils/normalizar-evento-pagarme.util';
import { normalizarEventoStripe } from 'src/modules/vendas/utils/normalizar-evento-stripe.util';
import { normalizarGateway } from 'src/modules/vendas/utils/normalizar-gateway.util';
import { normalizarPagamentoMercadoPago } from 'src/modules/vendas/utils/normalizar-pagamento-mercado-pago.util';
import { normalizarWebhookGenerico } from 'src/modules/vendas/utils/normalizar-webhook-generico.util';

// Used by the authenticated generic route to import events already in a gateway's own format.
export const normalizarPorFormato = (
  formato: FormatoImportacao,
  item: unknown,
): { gateway: GatewayPagamento; resultado: ResultadoNormalizacao } => {
  switch (formato) {
    case 'stripe':
      return { gateway: 'STRIPE', resultado: normalizarEventoStripe(item) };
    case 'mercado_pago':
      return {
        gateway: 'MERCADO_PAGO',
        resultado: normalizarPagamentoMercadoPago(item, 'importacao.mercado_pago'),
      };
    case 'asaas':
      return { gateway: 'ASAAS', resultado: normalizarEventoAsaas(item) };
    case 'pagarme':
      return { gateway: 'PAGARME', resultado: normalizarEventoPagarme(item) };
    case 'generico':
      return {
        gateway: normalizarGateway(lerTexto(lerObjeto(item).gateway), 'OUTRO'),
        resultado: normalizarWebhookGenerico(item),
      };
  }
};
