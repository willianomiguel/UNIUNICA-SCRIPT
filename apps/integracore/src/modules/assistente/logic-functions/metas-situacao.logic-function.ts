import { RestApiClient } from 'integra-client-sdk/rest';
import { defineLogicFunction } from 'integra-sdk/define';

import { ASSISTENTE_UNIVERSAL_IDENTIFIERS } from 'src/modules/assistente/constants/assistente-universal-identifiers';
import { metasSituacaoInputSchema } from 'src/modules/assistente/schemas/assistente-input.schema';
import { obterSituacaoMetas } from 'src/modules/assistente/services/obter-situacao-metas.service';
import { validarEntradaMetas } from 'src/modules/assistente/utils/validar-entrada-metas.util';
import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';

const handler = async (input: unknown) => {
  try {
    const entrada = validarEntradaMetas(input);

    if (!entrada.ok) {
      return { ok: false, erro: entrada.erro };
    }

    const situacao = await obterSituacaoMetas(new RestApiClient(), hojeIso(), entrada.valor);

    return { ok: true, ...situacao };
  } catch (erro) {
    console.error('[assistente] metas-situacao:', erro instanceof Error ? erro.message : 'erro desconhecido');

    return { ok: false, erro: 'Falha ao consultar metas. Tente de novo.' };
  }
};

export default defineLogicFunction({
  universalIdentifier: ASSISTENTE_UNIVERSAL_IDENTIFIERS.logicFunctions.metasSituacao,
  name: 'metas_situacao',
  description:
    'Situação das metas com valores recalculados na hora: valor atual e alvo (com unidade), progresso %, status, dias restantes e quanto falta por dia para bater. Filtros opcionais por status e por texto no título. Use para "como estão as metas?", "vamos bater a meta de faturamento?".',
  timeoutSeconds: 30,
  handler,
  toolTriggerSettings: { inputSchema: metasSituacaoInputSchema },
});
