import { type EventoGithubInterpretado } from 'src/modules/sprints/types/evento-github-interpretado';
import { type TarefaSprint } from 'src/modules/sprints/types/tarefa-sprint';
import { decidirNovoStatusTarefa } from 'src/modules/sprints/utils/decidir-novo-status-tarefa.util';

// Campos a atualizar numa tarefa por causa de um evento do GitHub.
// Objeto vazio = nada a mudar.
export const montarAlteracoesTarefaGithub = (
  tarefa: Pick<TarefaSprint, 'status' | 'branch' | 'prUrl'>,
  evento: EventoGithubInterpretado,
): Record<string, unknown> => {
  const alteracoes: Record<string, unknown> = {};

  if (evento.prUrl && tarefa.prUrl?.primaryLinkUrl !== evento.prUrl) {
    alteracoes.prUrl = {
      primaryLinkUrl: evento.prUrl,
      primaryLinkLabel: evento.prTitulo ?? 'Pull request',
      secondaryLinks: [],
    };
  }

  if (evento.branch && tarefa.branch !== evento.branch) {
    alteracoes.branch = evento.branch;
  }

  const novoStatus = decidirNovoStatusTarefa(tarefa.status, evento.acao);

  if (novoStatus) {
    alteracoes.status = novoStatus;
  }

  return alteracoes;
};
