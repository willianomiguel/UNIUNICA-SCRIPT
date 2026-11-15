import { type RestApiClient } from 'twenty-client-sdk/rest';

import { buscarRegistro } from 'src/modules/sprints/services/buscar-registro.service';
import { listarRegistros } from 'src/modules/sprints/services/listar-registros.service';
import { recalcularPontosSprint } from 'src/modules/sprints/services/recalcular-pontos-sprint.service';
import { type ResultadoAcaoSprint } from 'src/modules/sprints/types/resultado-acao-sprint';
import { type SprintResumo } from 'src/modules/sprints/types/sprint-resumo';
import { type TarefaSprint } from 'src/modules/sprints/types/tarefa-sprint';
import { escolherProximaSprint } from 'src/modules/sprints/utils/escolher-proxima-sprint.util';

// Encerra a sprint: grava a foto final do burndown, move as tarefas não
// concluídas para a próxima sprint PLANEJADA (mesmo projeto primeiro) ou
// para o backlog (sem sprint) e marca a sprint como CONCLUIDA.
export const encerrarSprint = async (
  cliente: RestApiClient,
  sprintId: string,
): Promise<ResultadoAcaoSprint> => {
  const sprint = await buscarRegistro<SprintResumo>(cliente, 'sprints', 'sprint', sprintId);

  if (!sprint) {
    return { id: sprintId, status: 'NAO_ENCONTRADA', mensagem: 'Sprint não encontrada' };
  }

  if (sprint.status === 'CONCLUIDA' || sprint.status === 'CANCELADA') {
    return { id: sprintId, status: 'IGNORADA', mensagem: `${sprint.nome ?? 'Sprint'} já foi encerrada.` };
  }

  // Foto final antes de tirar as tarefas pendentes da sprint.
  await recalcularPontosSprint(cliente, sprintId, { registrarFoto: true });

  const pendentes = await listarRegistros<TarefaSprint>(cliente, 'tasks', {
    filter: `and(sprintId[eq]:${sprintId},or(status[neq]:DONE,status[is]:NULL))`,
    depth: '0',
  });
  const planejadas = await listarRegistros<SprintResumo>(cliente, 'sprints', {
    filter: 'status[eq]:PLANEJADA',
    depth: '0',
  });
  const proxima = escolherProximaSprint(sprint, planejadas);

  for (const tarefa of pendentes) {
    await cliente.patch(`/rest/tasks/${tarefa.id}`, {
      sprintId: proxima?.id ?? null,
    });
  }

  await recalcularPontosSprint(cliente, sprintId, {
    registrarFoto: false,
    extras: { status: 'CONCLUIDA', precisaEncerrar: false },
  });

  const destino = proxima ? (proxima.nome ?? 'a próxima sprint') : 'o backlog';
  const mensagem =
    pendentes.length === 0
      ? 'Todas as tarefas estavam concluídas.'
      : `${pendentes.length} tarefa${pendentes.length > 1 ? 's' : ''} movida${pendentes.length > 1 ? 's' : ''} para ${destino}.`;

  return { id: sprintId, status: 'OK', mensagem };
};
