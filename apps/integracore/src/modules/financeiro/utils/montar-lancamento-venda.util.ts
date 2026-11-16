import { type LancamentoPayload } from 'src/modules/financeiro/types/lancamento-payload';
import { type VendaResumo } from 'src/modules/financeiro/types/venda-resumo';
import { reaisParaMicros } from 'src/modules/financeiro/utils/reais-para-micros.util';

const STATUS_ESTORNO: Record<string, string> = {
  REEMBOLSADA: 'Reembolso',
  CHARGEBACK: 'Chargeback',
};

// Lançamento que uma venda deve gerar no status atual, ou null se nenhum.
// APROVADA → ENTRADA; REEMBOLSADA/CHARGEBACK → SAÍDA de estorno. A chave de
// idempotência é a mesma para reembolso e chargeback: só um estorno por venda.
export const montarLancamentoVenda = (
  venda: VendaResumo,
  hoje: string,
): LancamentoPayload | null => {
  const valor = venda.valorLiquido ?? venda.valor;

  if (valor === null || valor <= 0) {
    return null;
  }

  const data = venda.dataEvento?.slice(0, 10) ?? hoje;
  const descricaoVenda = venda.descricao ?? `Venda ${venda.id.slice(0, 8)}`;
  const base = {
    valor: { amountMicros: reaisParaMicros(valor), currencyCode: 'BRL' },
    data,
    vencimento: data,
    status: 'PAGO',
    recorrencia: 'NENHUMA',
    origem: 'VENDA',
    vendaId: venda.id,
  };

  if (venda.status === 'APROVADA') {
    return {
      ...base,
      descricao: `Venda: ${descricaoVenda}`,
      tipo: 'ENTRADA',
      chaveIdempotencia: `venda:${venda.id}:entrada`,
    };
  }

  const motivo = venda.status ? STATUS_ESTORNO[venda.status] : undefined;

  if (motivo === undefined) {
    return null;
  }

  return {
    ...base,
    data: hoje,
    vencimento: hoje,
    descricao: `${motivo}: ${descricaoVenda}`,
    tipo: 'SAIDA',
    chaveIdempotencia: `venda:${venda.id}:estorno`,
  };
};
