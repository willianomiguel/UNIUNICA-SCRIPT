import { type TarefaSprint } from 'src/modules/sprints/types/tarefa-sprint';

const ORDEM_PRIORIDADE: Record<string, number> = {
  URGENTE: 0,
  ALTA: 1,
  MEDIA: 2,
  BAIXA: 3,
};

// Separa as tarefas nas colunas do quadro (TODO, IN_PROGRESS, DONE),
// ordenadas por prioridade e depois por código. Status vazio vai para TODO.
export const agruparTarefasPorStatus = (
  tarefas: TarefaSprint[],
): Record<'TODO' | 'IN_PROGRESS' | 'DONE', TarefaSprint[]> => {
  const colunas: Record<'TODO' | 'IN_PROGRESS' | 'DONE', TarefaSprint[]> = {
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  };

  for (const tarefa of tarefas) {
    const status =
      tarefa.status === 'IN_PROGRESS' || tarefa.status === 'DONE'
        ? tarefa.status
        : 'TODO';

    colunas[status].push(tarefa);
  }

  const ordenar = (a: TarefaSprint, b: TarefaSprint) =>
    (ORDEM_PRIORIDADE[a.prioridade ?? ''] ?? 9) -
      (ORDEM_PRIORIDADE[b.prioridade ?? ''] ?? 9) ||
    (a.numero ?? Number.MAX_SAFE_INTEGER) - (b.numero ?? Number.MAX_SAFE_INTEGER);

  colunas.TODO.sort(ordenar);
  colunas.IN_PROGRESS.sort(ordenar);
  colunas.DONE.sort(ordenar);

  return colunas;
};
