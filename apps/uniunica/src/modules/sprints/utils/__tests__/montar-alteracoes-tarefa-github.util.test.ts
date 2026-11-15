import { describe, expect, it } from 'vitest';

import { montarAlteracoesTarefaGithub } from 'src/modules/sprints/utils/montar-alteracoes-tarefa-github.util';

const evento = {
  codigos: ['UNI-1'],
  acao: 'EM_ANDAMENTO' as const,
  prUrl: 'https://github.com/o/r/pull/1',
  prTitulo: 'UNI-1 Login',
  branch: 'feature/uni-1',
};

describe('montarAlteracoesTarefaGithub', () => {
  it('liga PR, branch e muda status', () => {
    expect(montarAlteracoesTarefaGithub({ status: 'TODO' }, evento)).toEqual({
      prUrl: {
        primaryLinkUrl: 'https://github.com/o/r/pull/1',
        primaryLinkLabel: 'UNI-1 Login',
        secondaryLinks: [],
      },
      branch: 'feature/uni-1',
      status: 'IN_PROGRESS',
    });
  });

  it('não repete o que já está gravado', () => {
    expect(
      montarAlteracoesTarefaGithub(
        {
          status: 'IN_PROGRESS',
          branch: 'feature/uni-1',
          prUrl: { primaryLinkUrl: 'https://github.com/o/r/pull/1' },
        },
        evento,
      ),
    ).toEqual({});
  });

  it('merge conclui a tarefa', () => {
    expect(
      montarAlteracoesTarefaGithub(
        { status: 'IN_PROGRESS', branch: 'feature/uni-1' },
        { ...evento, acao: 'CONCLUIDA', prUrl: null },
      ),
    ).toEqual({ status: 'DONE' });
  });
});
