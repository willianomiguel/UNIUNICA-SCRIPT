import { type ResultadoNormalizacao } from 'src/modules/vendas/types/resultado-normalizacao';
import { type VendaStatus } from 'src/modules/vendas/types/venda-status';
import { lerDataIso } from 'src/modules/vendas/utils/ler-data-iso.util';
import { lerNumero } from 'src/modules/vendas/utils/ler-numero.util';
import { lerObjeto } from 'src/modules/vendas/utils/ler-objeto.util';
import { lerTexto } from 'src/modules/vendas/utils/ler-texto.util';
import { normalizarMetodoPagamento } from 'src/modules/vendas/utils/normalizar-metodo-pagamento.util';

type Mapeamento = { status: VendaStatus; motivo?: string; forcarStatus?: boolean };

const EVENTOS: Record<string, Mapeamento> = {
  PAYMENT_CREATED: { status: 'PENDENTE' },
  PAYMENT_AWAITING_RISK_ANALYSIS: { status: 'PENDENTE' },
  PAYMENT_APPROVED_BY_RISK_ANALYSIS: { status: 'PENDENTE' },
  PAYMENT_AUTHORIZED: { status: 'PENDENTE' },
  PAYMENT_CONFIRMED: { status: 'APROVADA' },
  PAYMENT_RECEIVED: { status: 'APROVADA' },
  PAYMENT_RECEIVED_IN_CASH: { status: 'APROVADA' },
  PAYMENT_REPROVED_BY_RISK_ANALYSIS: { status: 'RECUSADA', motivo: 'Reprovado na análise de risco' },
  PAYMENT_CREDIT_CARD_CAPTURE_REFUSED: { status: 'RECUSADA', motivo: 'Captura do cartão recusada' },
  PAYMENT_OVERDUE: { status: 'FALHA', motivo: 'Cobrança vencida sem pagamento' },
  PAYMENT_DELETED: { status: 'CANCELADA', motivo: 'Cobrança removida' },
  PAYMENT_REFUNDED: { status: 'REEMBOLSADA', motivo: 'Cobrança estornada' },
  PAYMENT_CHARGEBACK_REQUESTED: { status: 'CHARGEBACK', motivo: 'Chargeback solicitado' },
  PAYMENT_CHARGEBACK_DISPUTE: { status: 'CHARGEBACK', motivo: 'Chargeback em disputa' },
  PAYMENT_AWAITING_CHARGEBACK_REVERSAL: { status: 'CHARGEBACK', motivo: 'Aguardando reversão do chargeback' },
  PAYMENT_RESTORED: { status: 'PENDENTE', forcarStatus: true, motivo: 'Cobrança restaurada' },
};

export const normalizarEventoAsaas = (corpo: unknown): ResultadoNormalizacao => {
  const dados = lerObjeto(corpo);
  const tipoEvento = lerTexto(dados.event) ?? 'desconhecido';
  const pagamento = lerObjeto(dados, 'payment');
  const idExterno = lerTexto(pagamento.id);
  const mapeamento = EVENTOS[tipoEvento];

  if (idExterno === null) {
    return { tipo: 'IGNORADO', tipoEvento, idExterno: null, motivo: 'Evento sem cobrança (payment.id)' };
  }

  if (mapeamento === undefined) {
    return { tipo: 'IGNORADO', tipoEvento, idExterno, motivo: `Evento Asaas "${tipoEvento}" não é tratado` };
  }

  const valor = lerNumero(pagamento.value);
  const valorLiquido = lerNumero(pagamento.netValue);
  const pago = mapeamento.status === 'APROVADA';

  return {
    tipo: 'VENDA',
    tipoEvento,
    venda: {
      gateway: 'ASAAS',
      idExterno,
      status: mapeamento.status,
      forcarStatus: mapeamento.forcarStatus,
      moeda: 'BRL',
      valor,
      valorLiquido,
      taxaGateway:
        valor !== null && valorLiquido !== null
          ? Math.round((valor - valorLiquido) * 100) / 100
          : null,
      descricao: lerTexto(pagamento.description),
      metodoPagamento: normalizarMetodoPagamento(
        lerTexto(pagamento.billingType) === 'UNDEFINED' ? null : lerTexto(pagamento.billingType),
      ),
      parcelas: lerNumero(pagamento.installmentCount),
      dataEvento: pago
        ? (lerDataIso(pagamento.confirmedDate) ??
          lerDataIso(pagamento.paymentDate) ??
          lerDataIso(pagamento.dateCreated))
        : lerDataIso(pagamento.dateCreated),
      motivoRecusa: mapeamento.motivo ?? null,
    },
  };
};
