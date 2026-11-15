import { describe, expect, it } from 'vitest';

import { decidirNovoStatusTarefa } from 'src/modules/sprints/utils/decidir-novo-status-tarefa.util';

describe('decidirNovoStatusTarefa', () => {
  it('conclui tarefas não concluídas', () => {
    expect(decidirNovoStatusTarefa('TODO', 'CONCLUIDA')).toBe('DONE');
    expect(decidirNovoStatusTarefa('IN_PROGRESS', 'CONCLUIDA')).toBe('DONE');
    expect(decidirNovoStatusTarefa('DONE', 'CONCLUIDA')).toBeNull();
  });

  it('só move para em andamento a partir de TODO/vazio', () => {
    expect(decidirNovoStatusTarefa('TODO', 'EM_ANDAMENTO')).toBe('IN_PROGRESS');
    expect(decidirNovoStatusTarefa(null, 'EM_ANDAMENTO')).toBe('IN_PROGRESS');
    expect(decidirNovoStatusTarefa('IN_PROGRESS', 'EM_ANDAMENTO')).toBeNull();
    expect(decidirNovoStatusTarefa('DONE', 'EM_ANDAMENTO')).toBeNull();
  });

  it('NENHUMA nunca muda', () => {
    expect(decidirNovoStatusTarefa('TODO', 'NENHUMA')).toBeNull();
  });
});
