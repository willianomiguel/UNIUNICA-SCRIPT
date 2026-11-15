import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';
import { type DatabaseEventPayload } from 'twenty-sdk/logic-function';

import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';
import { CAMPOS_QUE_DISPARAM_RECALCULO } from 'src/modules/metas/constants/campos-que-disparam-recalculo';
import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { aplicarRecalculoMetas } from 'src/modules/metas/utils/aplicar-recalculo-metas.util';
import { OBJECTS } from 'src/modules/shared/constants/objects';

type EventoMeta = { properties?: { updatedFields?: string[] } };

// As escritas do próprio recálculo (progresso/status) não estão na lista,
// então não há laço; um valorAtual recalculado dispara uma rodada sem mudanças.
const handler = async (evento: DatabaseEventPayload<EventoMeta>) => {
  const acao = evento.name?.split('.').pop() ?? '';
  const camposAlterados = evento.properties?.updatedFields ?? [];

  if (
    acao === 'updated' &&
    !camposAlterados.some((campo) => CAMPOS_QUE_DISPARAM_RECALCULO.includes(campo))
  ) {
    return { resultado: 'IGNORADO' };
  }

  if (!['created', 'updated', 'deleted', 'restored', 'upserted'].includes(acao)) {
    return { resultado: 'IGNORADO' };
  }

  return aplicarRecalculoMetas(new RestApiClient({ runAs: 'application' }), hojeIso());
};

export default defineLogicFunction({
  universalIdentifier: METAS_IDS.LOGIC_AO_ALTERAR,
  name: 'metas-recalcular-ao-alterar',
  description:
    'Recalcula progresso e status assim que uma meta é criada, removida ou tem valores, datas ou meta principal alterados.',
  timeoutSeconds: 60,
  handler,
  eventTriggerSettings: {
    on: 'recordEvent',
    objectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
    action: '*',
  },
});
