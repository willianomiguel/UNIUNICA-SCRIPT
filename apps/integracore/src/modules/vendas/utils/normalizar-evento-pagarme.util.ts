import { type ResultadoNormalizacao } from 'src/modules/vendas/types/resultado-normalizacao';
import { type VendaStatus } from 'src/modules/vendas/types/venda-status';
import { centavosParaReais } from 'src/modules/vendas/utils/centavos-para-reais.util';
import { lerDataIso } from 'src/modules/vendas/utils/ler-data-iso.util';
import { lerNumero } from 'src/modules/vendas/utils/ler-numero.util';
import { lerObjeto } from 'src/modules/vendas/utils/ler-objeto.util';
import { lerTexto } from 'src/modules/vendas/utils/ler-texto.util';
import { normalizarMetodoPagamento } from 'src/modules/vendas/utils/normalizar-metodo-pagamento.util';

const EVENTOS: Record<string, VendaStatus> = {
  'charge.paid': 'APROVADA',
  'charge.pending': 'PENDENTE',
  'charge.processing': 'PENDENTE',
  'charge.payment_failed': 'FALHA',
  'charge.refunded': 'REEMBOLSADA',
  'charge.chargedback': 'CHARGEBACK',
  'charge.canceled': 'CANCELADA',
};

const STATUS_TRANSACAO_RECUSADA = ['not_authorized', 'refused'];

// Pagar.me API v5 charge webhooks; amounts arrive in cents.
export const normalizarEventoPagarme = (corpo: unknown): ResultadoNormalizacao => {
  const dados = lerObjeto(corpo);
  const tipoEvento = lerTexto(dados.type) ?? 'desconhecido';
  const cobranca = lerObjeto(dados, 'data');
  const idExterno = lerTexto(cobranca.id);
  const statusEvento = EVENTOS[tipoEvento];

  if (idExterno === null) {
    return { tipo: 'IGNORADO', tipoEvento, idExterno: null, motivo: 'Evento sem cobrança (data.id)' };
  }

  if (statusEvento === undefined) {
    return { tipo: 'IGNORADO', tipoEvento, idExterno, motivo: `Evento Pagar.me "${tipoEvento}" não é tratado` };
  }

  const transacao = lerObjeto(cobranca, 'last_transaction');
  const cliente = lerObjeto(cobranca, 'customer');
  const metadata = lerObjeto(cobranca, 'metadata');
  const statusTransacao = lerTexto(transacao.status);
  const status: VendaStatus =
    statusEvento === 'FALHA' &&
    statusTransacao !== null &&
    STATUS_TRANSACAO_RECUSADA.includes(statusTransacao)
      ? 'RECUSADA'
      : statusEvento;
  const erros = Array.isArray(lerObjeto(transacao, 'gateway_response').errors)
    ? (lerObjeto(transacao, 'gateway_response').errors as unknown[])
        .map((erro) => lerTexto(lerObjeto(erro).message))
        .filter((mensagem): mensagem is string => mensagem !== null)
    : [];
  const motivoFalha = lerTexto(transacao.acquirer_message) ?? erros[0] ?? 'Pagamento não autorizado';
  const motivo: Partial<Record<VendaStatus, string>> = {
    RECUSADA: motivoFalha,
    FALHA: motivoFalha,
    REEMBOLSADA: 'Cobrança estornada',
    CHARGEBACK: 'Chargeback',
    CANCELADA: 'Cobrança cancelada',
  };

  return {
    tipo: 'VENDA',
    tipoEvento,
    venda: {
      gateway: 'PAGARME',
      idExterno,
      status,
      moeda: lerTexto(cobranca.currency),
      valor: centavosParaReais(lerNumero(cobranca.amount)),
      descricao:
        lerTexto(cobranca.description) ??
        lerTexto(metadata.produto) ??
        lerTexto(lerObjeto(cobranca, 'order').code) ??
        lerTexto(cobranca.code),
      metodoPagamento: normalizarMetodoPagamento(lerTexto(cobranca.payment_method)),
      parcelas: lerNumero(transacao.installments),
      clienteNome: lerTexto(cliente.name),
      clienteEmail: lerTexto(cliente.email),
      dataEvento:
        status === 'APROVADA'
          ? (lerDataIso(cobranca.paid_at) ?? lerDataIso(cobranca.created_at))
          : lerDataIso(cobranca.created_at),
      motivoRecusa: motivo[status] ?? null,
      utmSource: lerTexto(metadata.utm_source),
      utmMedium: lerTexto(metadata.utm_medium),
      utmCampaign: lerTexto(metadata.utm_campaign),
    },
  };
};
