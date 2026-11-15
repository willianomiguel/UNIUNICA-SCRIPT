import { type BulkActionResult } from 'src/modules/projetos/types/bulk-action-result';

type SnackbarParams = {
  message: string;
  variant: 'success' | 'warning' | 'error';
  detailedMessage?: string;
};

// Mensagem de retorno (snackbar) de uma ação em lote, em português.
// `successLabel(n)` descreve o que deu certo, ex.: n => `${n} voto(s) registrado(s)`.
export const buildBulkActionSnackbar = (
  result: BulkActionResult,
  successLabel: (count: number) => string,
): SnackbarParams => {
  const firstProblem = result.results.find((item) => item.status !== 'SUCCESS')?.message;

  if (result.total === 0) {
    return { message: 'Nenhum registro selecionado.', variant: 'warning' };
  }

  if (result.failedCount === result.total) {
    return { message: 'Não foi possível concluir a ação.', variant: 'error', detailedMessage: firstProblem };
  }

  if (result.failedCount > 0 || result.skippedCount > 0) {
    const parts = [successLabel(result.successCount)];

    if (result.skippedCount > 0) {
      parts.push(`${result.skippedCount} ignorado(s)`);
    }

    if (result.failedCount > 0) {
      parts.push(`${result.failedCount} com erro`);
    }

    return { message: `${parts.join(', ')}.`, variant: 'warning', detailedMessage: firstProblem };
  }

  return { message: `${successLabel(result.successCount)}.`, variant: 'success' };
};
