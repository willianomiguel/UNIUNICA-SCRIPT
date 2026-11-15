import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';
import type { RoutePayload } from 'twenty-sdk/logic-function';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { iniciarSprint } from 'src/modules/sprints/services/iniciar-sprint.service';
import { type ResultadoAcaoSprint } from 'src/modules/sprints/types/resultado-acao-sprint';
import { normalizarRegistros } from 'src/modules/sprints/utils/normalizar-registros.util';
import { resumirResultadosAcao } from 'src/modules/sprints/utils/resumir-resultados-acao.util';

// Iniciar sprints em lote. Entrada: { records: [{ id }] }.
const handler = async (evento: RoutePayload) => {
  const ids = normalizarRegistros(evento.body);
  const cliente = new RestApiClient();
  const resultados: ResultadoAcaoSprint[] = [];

  for (const id of ids) {
    try {
      resultados.push(await iniciarSprint(cliente, id));
    } catch (erro) {
      resultados.push({
        id,
        status: 'FALHOU',
        mensagem: erro instanceof Error ? erro.message : String(erro),
      });
    }
  }

  return resumirResultadosAcao(resultados);
};

export default defineLogicFunction({
  universalIdentifier: SPRINTS_IDS.logicFunctions.iniciarSprint,
  name: 'sprints-iniciar-sprint',
  description: 'Iniciar sprints selecionadas',
  timeoutSeconds: 60,
  handler,
  httpRouteTriggerSettings: {
    path: '/sprints/iniciar',
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
