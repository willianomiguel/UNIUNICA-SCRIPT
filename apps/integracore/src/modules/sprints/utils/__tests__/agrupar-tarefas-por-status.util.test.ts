import { describe, expect, it } from 'vitest';

import { agruparTarefasPorStatus } from 'src/modules/sprints/utils/agrupar-tarefas-por-status.util';

describe('agruparTarefasPorStatus', () => {
  it('separa por status e ordena por prioridade e número', () => {
    const colunas = agruparTarefasPorStatus([
      { id: '1', status: 'TODO', prioridade: 'BAIXA', numero: 1 },
      { id: '2', status: 'TODO', prioridade: 'URGENTE', numero: 5 },
      { id: '3', status: null, numero: 2 },
      { id: '4', status: 'IN_PROGRESS', prioridade: 'ALTA', numero: 4 },
      { id: '5', status: 'DONE', numero: 3 },
      { id: '6', status: 'TODO', prioridade: 'URGENTE', numero: 3 },
    ]);

    expect(colunas.TODO.map((t) => t.id)).toEqual(['6', '2', '1', '3']);
    expect(colunas.IN_PROGRESS.map((t) => t.id)).toEqual(['4']);
    expect(colunas.DONE.map((t) => t.id)).toEqual(['5']);
  });

  it('lista vazia', () => {
    expect(agruparTarefasPorStatus([])).toEqual({ TODO: [], IN_PROGRESS: [], DONE: [] });
  });
});
