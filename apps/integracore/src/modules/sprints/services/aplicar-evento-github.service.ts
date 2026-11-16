import { type RestApiClient } from 'integra-client-sdk/rest';

import { listarRegistros } from 'src/modules/sprints/services/listar-registros.service';
import { type EventoGithubInterpretado } from 'src/modules/sprints/types/evento-github-interpretado';
import { type TarefaSprint } from 'src/modules/sprints/types/tarefa-sprint';
import { montarAlteracoesTarefaGithub } from 'src/modules/sprints/utils/montar-alteracoes-tarefa-github.util';

type ResultadoTarefa = {
  codigo: string;
  status: 'ATUALIZADA' | 'SEM_MUDANCA' | 'NAO_ENCONTRADA';
  tarefaId?: string;
  alteracoes?: Record<string, unknown>;
};

// Aplica um evento do GitHub já interpretado às tarefas citadas nele.
export const aplicarEventoGithub = async (
  cliente: RestApiClient,
  evento: EventoGithubInterpretado,
): Promise<ResultadoTarefa[]> => {
  const resultados: ResultadoTarefa[] = [];

  for (const codigo of evento.codigos) {
    const [tarefa] = await listarRegistros<TarefaSprint>(cliente, 'tasks', {
      filter: `codigo[eq]:"${codigo}"`,
      depth: '0',
    });

    if (!tarefa) {
      resultados.push({ codigo, status: 'NAO_ENCONTRADA' });
      continue;
    }

    const alteracoes = montarAlteracoesTarefaGithub(tarefa, evento);

    if (Object.keys(alteracoes).length === 0) {
      resultados.push({ codigo, status: 'SEM_MUDANCA', tarefaId: tarefa.id });
      continue;
    }

    await cliente.patch(`/rest/tasks/${tarefa.id}`, alteracoes);
    resultados.push({
      codigo,
      status: 'ATUALIZADA',
      tarefaId: tarefa.id,
      alteracoes,
    });
  }

  return resultados;
};
