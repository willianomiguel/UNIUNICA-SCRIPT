import { RestApiClient } from 'integra-client-sdk/rest';
import { defineLogicFunction } from 'integra-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { listarRegistros } from 'src/modules/sprints/services/listar-registros.service';
import { recalcularPontosSprint } from 'src/modules/sprints/services/recalcular-pontos-sprint.service';
import { type SprintResumo } from 'src/modules/sprints/types/sprint-resumo';
import { dataHojeIso } from 'src/modules/sprints/utils/data-hoje-iso.util';
import { sprintPrecisaEncerrar } from 'src/modules/sprints/utils/sprint-precisa-encerrar.util';

// Todo dia às 23:47 (Brasília): para cada sprint ATIVA, recalcula os pontos,
// grava a foto do dia no burndown e, se a data de fim já passou, marca
// "Precisa encerrar" (não encerra sozinha: o time usa a ação "Encerrar sprint"
// para decidir o destino das tarefas não concluídas).
const handler = async () => {
  const cliente = new RestApiClient();
  const hoje = dataHojeIso();
  const ativas = await listarRegistros<SprintResumo>(cliente, 'sprints', {
    filter: 'status[eq]:ATIVA',
    depth: '0',
  });
  const resultados = [];

  for (const sprint of ativas) {
    const precisaEncerrar = sprintPrecisaEncerrar(sprint, hoje);
    const pontos = await recalcularPontosSprint(cliente, sprint.id, {
      registrarFoto: true,
      extras:
        precisaEncerrar !== Boolean(sprint.precisaEncerrar)
          ? { precisaEncerrar }
          : undefined,
    });

    resultados.push({ id: sprint.id, nome: sprint.nome, precisaEncerrar, pontos });
  }

  return { hoje, sprintsAtivas: ativas.length, resultados };
};

export default defineLogicFunction({
  universalIdentifier: SPRINTS_IDS.logicFunctions.burndownDiario,
  name: 'sprints-burndown-diario',
  description:
    'Foto diária do burndown das sprints ativas e aviso de sprints vencidas',
  timeoutSeconds: 60,
  handler,
  cronTriggerSettings: {
    // 02:47 UTC = 23:47 em Brasília (UTC-3)
    pattern: '47 2 * * *',
  },
});
