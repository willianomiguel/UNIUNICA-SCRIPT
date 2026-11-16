import { RestApiClient } from 'integra-client-sdk/rest';
import { defineLogicFunction } from 'integra-sdk/define';

import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';
import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { aplicarRecalculoMetas } from 'src/modules/metas/utils/aplicar-recalculo-metas.util';

const handler = async () => {
  const resultado = await aplicarRecalculoMetas(
    new RestApiClient({ runAs: 'application' }),
    hojeIso(),
  );

  console.log('[metas] recálculo concluído', resultado);

  return resultado;
};

export default defineLogicFunction({
  universalIdentifier: METAS_IDS.LOGIC_RECALCULAR_CRON,
  name: 'metas-recalcular',
  description:
    'De hora em hora: atualiza o valor atual das metas automáticas (vendas, financeiro, tráfego), o progresso e o status de todas as metas.',
  timeoutSeconds: 120,
  handler,
  cronTriggerSettings: {
    pattern: '23 * * * *',
  },
});
