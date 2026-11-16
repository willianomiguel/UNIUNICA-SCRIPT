import { type AlertaRunResult } from 'src/modules/avisos/types/alerta-run-result';

export type AlertaRunSummary = {
  ok: boolean;
  enviadosCount: number;
  ignoradosCount: number;
  falhasCount: number;
  results: AlertaRunResult[];
};
