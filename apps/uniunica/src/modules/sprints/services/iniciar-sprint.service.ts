import { type RestApiClient } from 'twenty-client-sdk/rest';

import { buscarRegistro } from 'src/modules/sprints/services/buscar-registro.service';
import { recalcularPontosSprint } from 'src/modules/sprints/services/recalcular-pontos-sprint.service';
import { type ResultadoAcaoSprint } from 'src/modules/sprints/types/resultado-acao-sprint';
import { type SprintResumo } from 'src/modules/sprints/types/sprint-resumo';
import { dataHojeIso } from 'src/modules/sprints/utils/data-hoje-iso.util';

// Coloca a sprint como ATIVA (data de início = hoje, se vazia) e grava a
// primeira foto do burndown.
export const iniciarSprint = async (
  cliente: RestApiClient,
  sprintId: string,
): Promise<ResultadoAcaoSprint> => {
  const sprint = await buscarRegistro<SprintResumo>(cliente, 'sprints', 'sprint', sprintId);

  if (!sprint) {
    return { id: sprintId, status: 'NAO_ENCONTRADA', mensagem: 'Sprint não encontrada' };
  }

  if (sprint.status === 'ATIVA') {
    return { id: sprintId, status: 'IGNORADA', mensagem: `${sprint.nome ?? 'Sprint'} já está ativa.` };
  }

  if (sprint.status === 'CONCLUIDA' || sprint.status === 'CANCELADA') {
    return {
      id: sprintId,
      status: 'IGNORADA',
      mensagem: `${sprint.nome ?? 'Sprint'} já foi encerrada.`,
    };
  }

  await recalcularPontosSprint(cliente, sprintId, {
    registrarFoto: true,
    extras: {
      status: 'ATIVA',
      precisaEncerrar: false,
      ...(sprint.dataInicio ? {} : { dataInicio: dataHojeIso() }),
    },
  });

  return { id: sprintId, status: 'OK', mensagem: '' };
};
