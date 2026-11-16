import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';

// Pendente com vencimento (ou data, se não houver vencimento) antes de hoje.
export const estaAtrasado = (
  lancamento: Pick<LancamentoResumo, 'status' | 'vencimento' | 'data'>,
  hoje: string,
): boolean => {
  if (lancamento.status !== 'PENDENTE') {
    return false;
  }

  const limite = lancamento.vencimento ?? lancamento.data;

  return limite !== null && limite.slice(0, 10) < hoje;
};
