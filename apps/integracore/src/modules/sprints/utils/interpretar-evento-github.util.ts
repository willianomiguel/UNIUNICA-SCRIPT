import { type EventoGithubInterpretado } from 'src/modules/sprints/types/evento-github-interpretado';
import { extrairCodigosTarefa } from 'src/modules/sprints/utils/extrair-codigos-tarefa.util';

type CorpoGithub = {
  action?: string;
  pull_request?: {
    html_url?: string;
    title?: string;
    body?: string | null;
    merged?: boolean;
    head?: { ref?: string };
  };
  ref?: string;
  deleted?: boolean;
  repository?: { default_branch?: string };
  commits?: Array<{ message?: string }>;
  head_commit?: { message?: string } | null;
};

const ACOES_PR_ABERTO = ['opened', 'reopened', 'ready_for_review'];

const nomeDaBranch = (ref: string | undefined): string | null => {
  if (!ref || !ref.startsWith('refs/heads/')) {
    return null;
  }

  return ref.slice('refs/heads/'.length) || null;
};

// Traduz um evento do GitHub (pull_request ou push) no que deve acontecer
// com as tarefas citadas. Devolve null para eventos que não interessam.
export const interpretarEventoGithub = (
  nomeEvento: string | null | undefined,
  corpo: unknown,
): EventoGithubInterpretado | null => {
  if (!corpo || typeof corpo !== 'object') {
    return null;
  }

  const dados = corpo as CorpoGithub;

  if (nomeEvento === 'pull_request' && dados.pull_request) {
    const pr = dados.pull_request;
    const branch = pr.head?.ref ?? null;
    const codigos = extrairCodigosTarefa([pr.title, branch, pr.body]);
    const acao = ACOES_PR_ABERTO.includes(dados.action ?? '')
      ? 'EM_ANDAMENTO'
      : dados.action === 'closed' && pr.merged === true
        ? 'CONCLUIDA'
        : 'NENHUMA';

    return {
      codigos,
      acao,
      prUrl: pr.html_url ?? null,
      prTitulo: pr.title ?? null,
      branch,
    };
  }

  if (nomeEvento === 'push') {
    const branch = nomeDaBranch(dados.ref);

    if (!branch || dados.deleted === true) {
      return null;
    }

    const ehBranchPrincipal = branch === dados.repository?.default_branch;
    const mensagens = (dados.commits ?? []).map((commit) => commit.message);
    const codigos = extrairCodigosTarefa([
      ehBranchPrincipal ? null : branch,
      ...mensagens,
      dados.head_commit?.message,
    ]);

    return {
      codigos,
      // Commits na branch principal não indicam trabalho em andamento.
      acao: ehBranchPrincipal ? 'NENHUMA' : 'EM_ANDAMENTO',
      prUrl: null,
      prTitulo: null,
      branch: ehBranchPrincipal ? null : branch,
    };
  }

  return null;
};
