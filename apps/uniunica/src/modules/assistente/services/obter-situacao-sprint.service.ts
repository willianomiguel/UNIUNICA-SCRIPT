import { type MembroWorkspace } from 'src/modules/assistente/types/membro-workspace';
import { type SituacaoSprint } from 'src/modules/assistente/types/situacao-sprint';
import { type SprintAssistente } from 'src/modules/assistente/types/sprint-assistente';
import { type TarefaAssistente } from 'src/modules/assistente/types/tarefa-assistente';
import { escolherSprint } from 'src/modules/assistente/utils/escolher-sprint.util';
import { montarSituacaoSprint } from 'src/modules/assistente/utils/montar-situacao-sprint.util';
import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';

// Devolve a situação da sprint ou null quando não há sprint ativa (ou o id não existe).
export const obterSituacaoSprint = async (
  cliente: ClienteRest,
  sprintId: string | null,
  hoje: string,
): Promise<SituacaoSprint | null> => {
  const sprints = (await listarRegistros(cliente, 'sprints')) as SprintAssistente[];
  const sprint = escolherSprint(sprints, sprintId);

  if (sprint === null) {
    return null;
  }

  const tarefas = (await listarRegistros(cliente, 'tasks', `sprintId[eq]:${sprint.id}`)) as TarefaAssistente[];
  let membros: MembroWorkspace[] = [];

  try {
    membros = (await listarRegistros(cliente, 'workspaceMembers')) as MembroWorkspace[];
  } catch (erro) {
    console.warn('[assistente] não foi possível ler os membros; responsáveis ficam em branco', erro instanceof Error ? erro.message : 'erro desconhecido');
  }

  return montarSituacaoSprint({ sprint, tarefas, membros, hoje });
};
