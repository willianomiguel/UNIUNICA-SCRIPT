import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';
import { mesDoLancamento } from 'src/modules/financeiro/utils/mes-do-lancamento.util';

// Saldo (entradas - saídas, sem cancelados) de tudo que é anterior ao mês YYYY-MM.
export const calcularSaldoAnterior = (
  lancamentos: LancamentoResumo[],
  mes: string,
): number => {
  const saldo = lancamentos.reduce((total, lancamento) => {
    const mesLancamento = mesDoLancamento(lancamento);

    if (
      lancamento.status === 'CANCELADO' ||
      mesLancamento === null ||
      mesLancamento >= mes
    ) {
      return total;
    }

    return total + (lancamento.tipo === 'ENTRADA' ? lancamento.valor : -lancamento.valor);
  }, 0);

  return Math.round(saldo * 100) / 100;
};
