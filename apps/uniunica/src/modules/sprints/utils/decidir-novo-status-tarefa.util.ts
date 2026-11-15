import { type AcaoGithub } from 'src/modules/sprints/types/acao-github';
import { type StatusTarefa } from 'src/modules/sprints/types/status-tarefa';

// Novo status da tarefa para uma ação do GitHub, ou null se não deve mudar.
// Nunca volta uma tarefa concluída para "em andamento".
export const decidirNovoStatusTarefa = (
  statusAtual: string | null | undefined,
  acao: AcaoGithub,
): StatusTarefa | null => {
  if (acao === 'CONCLUIDA') {
    return statusAtual === 'DONE' ? null : 'DONE';
  }

  if (acao === 'EM_ANDAMENTO') {
    return !statusAtual || statusAtual === 'TODO' ? 'IN_PROGRESS' : null;
  }

  return null;
};
