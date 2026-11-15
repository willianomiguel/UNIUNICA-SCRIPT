import { type ObjetoJson } from 'src/modules/vendas/types/objeto-json';
import { type ResultadoNormalizacao } from 'src/modules/vendas/types/resultado-normalizacao';
import { type VendaNormalizada } from 'src/modules/vendas/types/venda-normalizada';
import { centavosParaReais } from 'src/modules/vendas/utils/centavos-para-reais.util';
import { lerDataIso } from 'src/modules/vendas/utils/ler-data-iso.util';
import { lerNumero } from 'src/modules/vendas/utils/ler-numero.util';
import { lerObjeto } from 'src/modules/vendas/utils/ler-objeto.util';
import { lerTexto } from 'src/modules/vendas/utils/ler-texto.util';
import { normalizarMetodoPagamento } from 'src/modules/vendas/utils/normalizar-metodo-pagamento.util';

const dadosComuns = (objeto: ObjetoJson) => {
  const metadata = lerObjeto(objeto, 'metadata');
  const tiposMetodo = Array.isArray(objeto.payment_method_types)
    ? objeto.payment_method_types
    : [];
  const tipoDetalhe = lerTexto(lerObjeto(objeto, 'payment_method_details').type);
  const parcelas =
    lerNumero(lerObjeto(objeto, 'payment_method_options', 'card', 'installments', 'plan').count) ??
    lerNumero(lerObjeto(objeto, 'payment_method_details', 'card', 'installments', 'plan').count);

  return {
    moeda: lerTexto(objeto.currency)?.toUpperCase() ?? null,
    descricao: lerTexto(objeto.description) ?? lerTexto(metadata.produto) ?? lerTexto(metadata.product),
    metodoPagamento: normalizarMetodoPagamento(tipoDetalhe ?? lerTexto(tiposMetodo[0])),
    parcelas,
    clienteNome:
      lerTexto(lerObjeto(objeto, 'billing_details').name) ??
      lerTexto(lerObjeto(objeto, 'shipping').name) ??
      lerTexto(metadata.cliente_nome) ??
      lerTexto(metadata.customer_name),
    clienteEmail:
      lerTexto(objeto.receipt_email) ??
      lerTexto(lerObjeto(objeto, 'billing_details').email) ??
      lerTexto(metadata.cliente_email) ??
      lerTexto(metadata.customer_email),
    utmSource: lerTexto(metadata.utm_source),
    utmMedium: lerTexto(metadata.utm_medium),
    utmCampaign: lerTexto(metadata.utm_campaign),
  };
};

const ignorar = (tipoEvento: string, idExterno: string | null, motivo: string): ResultadoNormalizacao => ({
  tipo: 'IGNORADO',
  tipoEvento,
  idExterno,
  motivo,
});

// Sales are keyed by PaymentIntent id; charge and dispute events point back to it.
export const normalizarEventoStripe = (evento: unknown): ResultadoNormalizacao => {
  const tipoEvento = lerTexto(lerObjeto(evento).type) ?? 'desconhecido';
  const objeto = lerObjeto(evento, 'data', 'object');
  const idObjeto = lerTexto(objeto.id);
  const idPaymentIntent = lerTexto(objeto.payment_intent);
  const venda = (dados: Omit<VendaNormalizada, 'gateway'>): ResultadoNormalizacao => ({
    tipo: 'VENDA',
    tipoEvento,
    venda: { gateway: 'STRIPE', ...dados },
  });

  switch (tipoEvento) {
    case 'payment_intent.succeeded':
    case 'payment_intent.processing':
    case 'payment_intent.canceled':
    case 'payment_intent.payment_failed': {
      if (idObjeto === null) {
        return ignorar(tipoEvento, null, 'PaymentIntent sem id');
      }

      const erro = lerObjeto(objeto, 'last_payment_error');
      const recusado = lerTexto(erro.code) === 'card_declined';
      const motivo = [lerTexto(erro.message), lerTexto(erro.decline_code)]
        .filter((parte) => parte !== null)
        .join(' — ');
      const status =
        tipoEvento === 'payment_intent.succeeded'
          ? 'APROVADA'
          : tipoEvento === 'payment_intent.processing'
            ? 'PENDENTE'
            : tipoEvento === 'payment_intent.canceled'
              ? 'CANCELADA'
              : recusado
                ? 'RECUSADA'
                : 'FALHA';

      return venda({
        idExterno: idObjeto,
        status,
        valor: centavosParaReais(lerNumero(objeto.amount)),
        dataEvento: lerDataIso(objeto.created),
        motivoRecusa:
          status === 'RECUSADA' || status === 'FALHA'
            ? motivo || 'Pagamento não concluído'
            : status === 'CANCELADA'
              ? lerTexto(objeto.cancellation_reason)
              : null,
        ...dadosComuns(objeto),
      });
    }
    case 'charge.refunded': {
      const idExterno = idPaymentIntent ?? idObjeto;

      if (idExterno === null) {
        return ignorar(tipoEvento, null, 'Cobrança sem id');
      }

      if (objeto.refunded !== true) {
        const reembolsado = centavosParaReais(lerNumero(objeto.amount_refunded)) ?? 0;

        return ignorar(
          tipoEvento,
          idExterno,
          `Reembolso parcial de ${reembolsado.toFixed(2)} ${lerTexto(objeto.currency)?.toUpperCase() ?? ''} — status mantido`,
        );
      }

      return venda({
        idExterno,
        status: 'REEMBOLSADA',
        valor: centavosParaReais(lerNumero(objeto.amount)),
        motivoRecusa: 'Reembolso total',
        ...dadosComuns(objeto),
      });
    }
    case 'charge.dispute.created':
    case 'charge.dispute.closed': {
      const idExterno = idPaymentIntent ?? lerTexto(objeto.charge);

      if (idExterno === null) {
        return ignorar(tipoEvento, null, 'Disputa sem cobrança associada');
      }

      const statusDisputa = lerTexto(objeto.status);
      const razao = lerTexto(objeto.reason);

      if (tipoEvento === 'charge.dispute.closed') {
        if (statusDisputa === 'won') {
          return venda({
            idExterno,
            status: 'APROVADA',
            forcarStatus: true,
            motivoRecusa: `Chargeback revertido (disputa ganha${razao ? `: ${razao}` : ''})`,
          });
        }

        if (statusDisputa !== 'lost') {
          return ignorar(tipoEvento, idExterno, `Disputa encerrada com status "${statusDisputa ?? ''}"`);
        }
      }

      return venda({
        idExterno,
        status: 'CHARGEBACK',
        motivoRecusa: `Chargeback${razao ? `: ${razao}` : ''}`,
      });
    }
    default:
      return ignorar(tipoEvento, idPaymentIntent ?? idObjeto, `Evento Stripe "${tipoEvento}" não é tratado`);
  }
};
