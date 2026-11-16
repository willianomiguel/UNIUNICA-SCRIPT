import { defineLogicFunction } from 'integra-sdk/define';

import { VINCULAR_VENDAS_CRON_LOGIC_FUNCTION_ID } from 'src/modules/trafego/constants/trafego-universal-identifiers';
import { vincularVendasCampanhas } from 'src/modules/trafego/services/vincular-vendas-campanhas.service';

// Rede de segurança: de hora em hora liga vendas antigas (ou campanhas cujo UTM mudou).
export const vincularVendasCronHandler = async () => vincularVendasCampanhas();

export default defineLogicFunction({
  universalIdentifier: VINCULAR_VENDAS_CRON_LOGIC_FUNCTION_ID,
  name: 'trafego-vincular-vendas-cron',
  description:
    'De hora em hora, liga às campanhas as vendas sem campanha que têm utm_campaign igual ao de uma campanha.',
  timeoutSeconds: 120,
  handler: vincularVendasCronHandler,
  cronTriggerSettings: { pattern: '23 * * * *' },
});
