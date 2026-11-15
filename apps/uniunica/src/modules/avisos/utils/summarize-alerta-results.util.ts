import { type AlertaRunResult } from 'src/modules/avisos/types/alerta-run-result';
import { type AlertaRunSummary } from 'src/modules/avisos/types/alerta-run-summary';

export const summarizeAlertaResults = (results: AlertaRunResult[]): AlertaRunSummary => {
  const falhasCount = results.filter((result) => result.status === 'FALHOU').length;

  return {
    ok: falhasCount === 0,
    enviadosCount: results.filter((result) => result.status === 'ENVIADO').length,
    ignoradosCount: results.filter((result) => result.status === 'IGNORADO').length,
    falhasCount,
    results,
  };
};
