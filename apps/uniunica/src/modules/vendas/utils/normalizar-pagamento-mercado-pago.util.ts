import { type ResultadoNormalizacao } from 'src/modules/vendas/types/resultado-normalizacao';
import { type VendaStatus } from 'src/modules/vendas/types/venda-status';
import { lerDataIso } from 'src/modules/vendas/utils/ler-data-iso.util';
import { lerNumero } from 'src/modules/vendas/utils/ler-numero.util';
import { lerObjeto } from 'src/modules/vendas/utils/ler-objeto.util';
import { lerTexto } from 'src/modules/vendas/utils/ler-texto.util';
import { normalizarMetodoPagamento } from 'src/modules/vendas/utils/normalizar-metodo-pagamento.util';

const STATUS: Record<string, VendaStatus> = {
  approved: 'APROVADA',
  authorized: 'PENDENTE',
  pending: 'PENDENTE',
  in_process: 'PENDENTE',
  rejected: 'RECUSADA',
  cancelled: 'CANCELADA',
  refunded: 'REEMBOLSADA',
  charged_back: 'CHARGEBACK',
  in_mediation: 'CHARGEBACK',
};

// Input is the payment resource returned by GET /v1/payments/{id}, not the notification.
export const normalizarPagamentoMercadoPago = (
  pagamento: unknown,
  tipoEvento: string,
): ResultadoNormalizacao => {
  const dados = lerObjeto(pagamento);
  const idExterno = lerTexto(dados.id);
  const statusMp = lerTexto(dados.status);
  const status = statusMp === null ? undefined : STATUS[statusMp];

  if (idExterno === null || status === undefined) {
    return {
      tipo: 'IGNORADO',
      tipoEvento,
      idExterno,
      motivo: idExterno === null ? 'Pagamento sem id' : `Status Mercado Pago "${statusMp ?? ''}" não é tratado`,
    };
  }

  const detalhes = lerObjeto(dados, 'transaction_details');
  const metadata = lerObjeto(dados, 'metadata');
  const pagador = lerObjeto(dados, 'payer');
  const taxas = Array.isArray(dados.fee_details)
    ? dados.fee_details.reduce<number>(
        (total, taxa) => total + (lerNumero(lerObjeto(taxa).amount) ?? 0),
        0,
      )
    : null;
  const nome = [lerTexto(pagador.first_name), lerTexto(pagador.last_name)]
    .filter((parte) => parte !== null)
    .join(' ');
  const tipoPagamento = lerTexto(dados.payment_type_id);
  const statusDetalhe = lerTexto(dados.status_detail);

  return {
    tipo: 'VENDA',
    tipoEvento,
    venda: {
      gateway: 'MERCADO_PAGO',
      idExterno,
      status,
      moeda: lerTexto(dados.currency_id),
      valor: lerNumero(dados.transaction_amount),
      valorLiquido: lerNumero(detalhes.net_received_amount),
      taxaGateway: taxas === null ? null : Math.round(taxas * 100) / 100,
      descricao: lerTexto(dados.description) ?? lerTexto(metadata.produto),
      metodoPagamento:
        lerTexto(dados.payment_method_id) === 'pix'
          ? 'PIX'
          : normalizarMetodoPagamento(tipoPagamento),
      parcelas: lerNumero(dados.installments),
      clienteNome: nome === '' ? null : nome,
      clienteEmail: lerTexto(pagador.email),
      dataEvento: lerDataIso(dados.date_approved) ?? lerDataIso(dados.date_created),
      motivoRecusa:
        status === 'APROVADA' || status === 'PENDENTE' ? null : statusDetalhe,
      utmSource: lerTexto(metadata.utm_source),
      utmMedium: lerTexto(metadata.utm_medium),
      utmCampaign: lerTexto(metadata.utm_campaign),
    },
  };
};
