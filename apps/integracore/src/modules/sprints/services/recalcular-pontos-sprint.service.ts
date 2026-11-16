import { type RestApiClient } from 'integra-client-sdk/rest';

import { buscarRegistro } from 'src/modules/sprints/services/buscar-registro.service';
import { listarRegistros } from 'src/modules/sprints/services/listar-registros.service';
import { type ResultadoPontosSprint } from 'src/modules/sprints/types/resultado-pontos-sprint';
import { type SprintResumo } from 'src/modules/sprints/types/sprint-resumo';
import { type TarefaSprint } from 'src/modules/sprints/types/tarefa-sprint';
import { calcularPontosSprint } from 'src/modules/sprints/utils/calcular-pontos-sprint.util';
import { dataHojeIso } from 'src/modules/sprints/utils/data-hoje-iso.util';
import { registrarPontoBurndown } from 'src/modules/sprints/utils/registrar-ponto-burndown.util';

// Recalcula pontosTotais/pontosConcluidos de uma sprint a partir das tarefas.
// Em sprints ATIVAS também atualiza a foto de hoje no histórico do burndown.
export const recalcularPontosSprint = async (
  cliente: RestApiClient,
  sprintId: string,
  opcoes: { registrarFoto?: boolean; extras?: Record<string, unknown> } = {},
): Promise<ResultadoPontosSprint | null> => {
  const sprint = await buscarRegistro<SprintResumo>(
    cliente,
    'sprints',
    'sprint',
    sprintId,
  );

  if (!sprint) {
    return null;
  }

  const tarefas = await listarRegistros<TarefaSprint>(cliente, 'tasks', {
    filter: `sprintId[eq]:${sprintId}`,
    depth: '0',
  });
  const resultado = calcularPontosSprint(tarefas);
  const status = (opcoes.extras?.status as string | undefined) ?? sprint.status;
  const alteracoes: Record<string, unknown> = { ...resultado, ...opcoes.extras };

  if (opcoes.registrarFoto ?? status === 'ATIVA') {
    alteracoes.historicoBurndown = registrarPontoBurndown(
      sprint.historicoBurndown,
      {
        data: dataHojeIso(),
        pontosRestantes: resultado.pontosTotais - resultado.pontosConcluidos,
        pontosTotais: resultado.pontosTotais,
      },
    );
  }

  await cliente.patch(`/rest/sprints/${sprintId}`, alteracoes);

  return resultado;
};
