import { describe, expect, it } from 'vitest';

import { interpretarEventoGithub } from 'src/modules/sprints/utils/interpretar-evento-github.util';

const pr = (action: string, merged = false) => ({
  action,
  pull_request: {
    html_url: 'https://github.com/uniunica/app/pull/5',
    title: 'UNI-42 Tela de login',
    body: 'Também fecha UNI-43',
    merged,
    head: { ref: 'feature/uni-42-login' },
  },
});

describe('interpretarEventoGithub', () => {
  it('PR aberto move para em andamento', () => {
    expect(interpretarEventoGithub('pull_request', pr('opened'))).toEqual({
      codigos: ['UNI-42', 'UNI-43'],
      acao: 'EM_ANDAMENTO',
      prUrl: 'https://github.com/uniunica/app/pull/5',
      prTitulo: 'UNI-42 Tela de login',
      branch: 'feature/uni-42-login',
    });
    expect(interpretarEventoGithub('pull_request', pr('reopened'))?.acao).toBe(
      'EM_ANDAMENTO',
    );
  });

  it('PR mergeado conclui; fechado sem merge não muda status', () => {
    expect(interpretarEventoGithub('pull_request', pr('closed', true))?.acao).toBe(
      'CONCLUIDA',
    );
    expect(interpretarEventoGithub('pull_request', pr('closed'))?.acao).toBe(
      'NENHUMA',
    );
    expect(interpretarEventoGithub('pull_request', pr('edited'))?.acao).toBe(
      'NENHUMA',
    );
  });

  it('push em branch de feature registra a branch', () => {
    expect(
      interpretarEventoGithub('push', {
        ref: 'refs/heads/fix/UNI-9',
        repository: { default_branch: 'main' },
        commits: [{ message: 'ajusta UNI-10' }],
        head_commit: { message: 'ajusta UNI-10' },
      }),
    ).toEqual({
      codigos: ['UNI-9', 'UNI-10'],
      acao: 'EM_ANDAMENTO',
      prUrl: null,
      prTitulo: null,
      branch: 'fix/UNI-9',
    });
  });

  it('push na branch principal não registra branch nem status', () => {
    expect(
      interpretarEventoGithub('push', {
        ref: 'refs/heads/main',
        repository: { default_branch: 'main' },
        commits: [{ message: 'merge UNI-3' }],
      }),
    ).toEqual({
      codigos: ['UNI-3'],
      acao: 'NENHUMA',
      prUrl: null,
      prTitulo: null,
      branch: null,
    });
  });

  it('ignora eventos irrelevantes', () => {
    expect(interpretarEventoGithub('ping', { zen: 'x' })).toBeNull();
    expect(interpretarEventoGithub('push', { ref: 'refs/tags/v1' })).toBeNull();
    expect(
      interpretarEventoGithub('push', { ref: 'refs/heads/x', deleted: true }),
    ).toBeNull();
    expect(interpretarEventoGithub('pull_request', null)).toBeNull();
    expect(interpretarEventoGithub('pull_request', {})).toBeNull();
  });
});
