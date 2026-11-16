import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';

import { ASSISTENTE_UNIVERSAL_IDENTIFIERS } from 'src/modules/assistente/constants/assistente-universal-identifiers';
import { sprintsSituacaoInputSchema } from 'src/modules/assistente/schemas/assistente-input.schema';
import { obterSituacaoSprint } from 'src/modules/assistente/services/obter-situacao-sprint.service';
import { validarEntradaSprints } from 'src/modules/assistente/utils/validar-entrada-sprints.util';
import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';

const handler = async (input: unknown) => {
  try {
    const entrada = validarEntradaSprints(input);

    if (!entrada.ok) {
      return { ok: false, erro: entrada.erro };
    }

    const situacao = await obterSituacaoSprint(new RestApiClient(), entrada.valor.sprintId, hojeIso());

    if (situacao === null) {
      return {
        ok: false,
        erro: entrada.valor.sprintId ? 'Sprint não encontrada.' : 'Não há sprint ativa no momento.',
      };
    }

    return { ok: true, ...situacao };
  } catch (erro) {
    console.error('[assistente] sprints-situacao:', erro instanceof Error ? erro.message : 'erro desconhecido');

    return { ok: false, erro: 'Falha ao consultar sprints. Tente de novo.' };
  }
};

export default defineLogicFunction({
  universalIdentifier: ASSISTENTE_UNIVERSAL_IDENTIFIERS.logicFunctions.sprintsSituacao,
  name: 'sprints_situacao',
  description:
    'Situação da sprint ativa (ou da indicada por sprintId): nome, objetivo, datas, dias restantes, pontos totais/concluídos/capacidade, percentual, se está atrasada pelo ritmo e até 20 tarefas abertas com responsável e status. Use para "como está a sprint?", "o que falta entregar?".',
  timeoutSeconds: 30,
  handler,
  toolTriggerSettings: { inputSchema: sprintsSituacaoInputSchema },
});
