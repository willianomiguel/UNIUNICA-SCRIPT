import { type SprintResumo } from 'src/modules/sprints/types/sprint-resumo';

// Uma sprint ATIVA cuja data de fim já passou precisa ser encerrada.
export const sprintPrecisaEncerrar = (
  sprint: Pick<SprintResumo, 'status' | 'dataFim'>,
  hoje: string,
): boolean =>
  sprint.status === 'ATIVA' &&
  typeof sprint.dataFim === 'string' &&
  sprint.dataFim.slice(0, 10) < hoje;
