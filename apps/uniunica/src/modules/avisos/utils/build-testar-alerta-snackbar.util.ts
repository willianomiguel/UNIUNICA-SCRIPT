import { type AlertaRunSummary } from 'src/modules/avisos/types/alerta-run-summary';

type SnackbarParams = {
  message: string;
  variant: 'success' | 'error' | 'warning';
  detailedMessage?: string;
};

export const buildTestarAlertaSnackbar = (summary: AlertaRunSummary): SnackbarParams => {
  const total = summary.results.length;
  const firstError = summary.results.find((result) => result.erro !== undefined)?.erro;

  if (total === 0) {
    return { message: 'Nenhum alerta selecionado para testar.', variant: 'warning' };
  }

  if (summary.falhasCount === 0) {
    return {
      message: total === 1 ? 'Mensagem de teste enviada.' : `${total} mensagens de teste enviadas.`,
      variant: 'success',
    };
  }

  if (summary.falhasCount === total) {
    return { message: 'Falha ao enviar o teste.', variant: 'error', detailedMessage: firstError };
  }

  return {
    message: `${summary.falhasCount} de ${total} testes falharam.`,
    variant: 'warning',
    detailedMessage: firstError,
  };
};
