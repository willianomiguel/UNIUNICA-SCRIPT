import { defineLogicFunction } from 'twenty-sdk/define';

import {
  VENDA_OBJECT_ID,
  VINCULAR_VENDAS_EVENTO_LOGIC_FUNCTION_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';
import { vincularVendasCampanhas } from 'src/modules/trafego/services/vincular-vendas-campanhas.service';
import { extrairIdsVendasEvento } from 'src/modules/trafego/utils/extrair-ids-vendas-evento.util';

// Quando uma venda é criada/alterada com utm_campaign e sem campanha, liga à campanha de mesmo UTM.
export const vincularVendasEventoHandler = async (payload: unknown) => {
  const ids = extrairIdsVendasEvento(payload);

  if (ids.length === 0) {
    return { verificadas: 0, vinculadas: 0 };
  }

  return vincularVendasCampanhas(ids);
};

export default defineLogicFunction({
  universalIdentifier: VINCULAR_VENDAS_EVENTO_LOGIC_FUNCTION_ID,
  name: 'trafego-vincular-vendas-evento',
  description:
    'Liga vendas novas ou alteradas à campanha pelo utm_campaign (quando venda.campanha está vazia).',
  timeoutSeconds: 60,
  handler: vincularVendasEventoHandler,
  eventTriggerSettings: {
    on: 'recordEvent',
    objectUniversalIdentifier: VENDA_OBJECT_ID,
    action: '*',
    batchMode: true,
  },
});
