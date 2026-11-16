import { type SprintResumo } from 'src/modules/sprints/types/sprint-resumo';

// Escolhe a sprint que recebe as tarefas não concluídas ao encerrar uma sprint:
// a PLANEJADA mais próxima (por data de início), dando preferência ao mesmo
// projeto. Devolve null quando não há nenhuma (as tarefas voltam ao backlog).
export const escolherProximaSprint = (
  atual: SprintResumo,
  candidatas: SprintResumo[],
): SprintResumo | null => {
  const planejadas = candidatas
    .filter((sprint) => sprint.id !== atual.id && sprint.status === 'PLANEJADA')
    .sort((a, b) =>
      (a.dataInicio ?? '9999-12-31').localeCompare(b.dataInicio ?? '9999-12-31'),
    );

  if (atual.projetoId) {
    const doMesmoProjeto = planejadas.find(
      (sprint) => sprint.projetoId === atual.projetoId,
    );

    if (doMesmoProjeto) {
      return doMesmoProjeto;
    }
  }

  return planejadas[0] ?? null;
};
