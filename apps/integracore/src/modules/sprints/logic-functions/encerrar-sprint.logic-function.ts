import { RestApiClient } from 'integra-client-sdk/rest';
import { defineLogicFunction } from 'integra-sdk/define';
import type { RoutePayload } from 'integra-sdk/logic-function';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { encerrarSprint } from 'src/modules/sprints/services/encerrar-sprint.service';
import { type ResultadoAcaoSprint } from 'src/modules/sprints/types/resultado-acao-sprint';
import { normalizarRegistros } from 'src/modules/sprints/utils/normalizar-registros.util';
import { resumirResultadosAcao } from 'src/modules/sprints/utils/resumir-resultados-acao.util';

// Encerrar sprints em lote. Entrada: { records: [{ id }] }.
const handler = async (evento: RoutePayload) => {
  const ids = normalizarRegistros(evento.body);
  const cliente = new RestApiClient();
  const resultados: ResultadoAcaoSprint[] = [];

  for (const id of ids) {
    try {
      resultados.push(await encerrarSprint(cliente, id));
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
  universalIdentifier: SPRINTS_IDS.logicFunctions.encerrarSprint,
  name: 'sprints-encerrar-sprint',
  description: 'Encerrar sprints selecionadas',
  timeoutSeconds: 60,
  handler,
  httpRouteTriggerSettings: {
    path: '/sprints/encerrar',
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
