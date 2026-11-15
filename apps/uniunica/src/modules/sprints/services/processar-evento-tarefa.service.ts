import { RestApiClient } from 'twenty-client-sdk/rest';

import { gerarProximoCodigoTarefa } from 'src/modules/sprints/services/gerar-proximo-codigo-tarefa.service';
import { recalcularPontosSprint } from 'src/modules/sprints/services/recalcular-pontos-sprint.service';
import { type TarefaSprint } from 'src/modules/sprints/types/tarefa-sprint';
import { decidirConcluidaEm } from 'src/modules/sprints/utils/decidir-concluida-em.util';

type EventoTarefa = {
  name?: string;
  recordId: string;
  properties: {
    before?: Partial<TarefaSprint>;
    after?: Partial<TarefaSprint>;
  };
};

// Eventos do objeto Task:
// - criação: gera o código UNI-<n>;
// - status -> DONE: grava concluidaEm (e limpa se sair de DONE);
// - qualquer mudança em status/pontos/sprint: recalcula os pontos da sprint.
export const processarEventoTarefa = async (
  evento: EventoTarefa,
  acao: 'created' | 'updated' | 'deleted' | 'restored',
) => {
  console.log('[sprints] evento recebido', acao, JSON.stringify(Object.keys(evento ?? {})));
  const cliente = new RestApiClient();
  const antes = evento.properties?.before ?? {};
  const depois = evento.properties?.after ?? {};
  const tarefaId = evento.recordId;
  const alteracoes: Record<string, unknown> = {};

  if (acao === 'created' || acao === 'updated') {
    if (acao === 'created' && !depois.codigo) {
      Object.assign(alteracoes, await gerarProximoCodigoTarefa(cliente));
    }

    const concluidaEm = decidirConcluidaEm({
      statusAntes: acao === 'created' ? null : antes.status,
      statusDepois: depois.status,
      concluidaEmAtual: depois.concluidaEm,
      agora: new Date(),
    });

    if (concluidaEm !== undefined) {
      alteracoes.concluidaEm = concluidaEm;
    }

    if (Object.keys(alteracoes).length > 0) {
      await cliente.patch(`/rest/tasks/${tarefaId}`, alteracoes);
    }
  }

  const sprintIds = [
    ...new Set([antes.sprintId, depois.sprintId].filter(Boolean)),
  ] as string[];

  for (const sprintId of sprintIds) {
    await recalcularPontosSprint(cliente, sprintId);
  }

  const resultado = { tarefaId, acao, alteracoes, sprintsRecalculadas: sprintIds };

  console.log('[sprints] evento de tarefa', JSON.stringify(resultado));

  return resultado;
};

