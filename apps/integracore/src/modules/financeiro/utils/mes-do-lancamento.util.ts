import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';

// Mês de referência (YYYY-MM): data do lançamento, ou o vencimento se não houver data.
export const mesDoLancamento = (
  lancamento: Pick<LancamentoResumo, 'data' | 'vencimento'>,
): string | null => {
  const referencia = lancamento.data ?? lancamento.vencimento;

  return referencia ? referencia.slice(0, 7) : null;
};
