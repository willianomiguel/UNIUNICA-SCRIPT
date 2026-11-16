// Atrasado = status ATRASADO, ou PENDENTE com vencimento antes de hoje.
export const countLancamentosAtrasados = (
  lancamentos: Array<{ status?: unknown; vencimento?: unknown }>,
  today: string,
): number =>
  lancamentos.filter((lancamento) => {
    if (lancamento.status === 'ATRASADO') {
      return true;
    }

    return (
      lancamento.status === 'PENDENTE' &&
      typeof lancamento.vencimento === 'string' &&
      lancamento.vencimento.slice(0, 10) < today
    );
  }).length;
