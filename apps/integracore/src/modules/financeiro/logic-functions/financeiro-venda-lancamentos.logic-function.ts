import { RestApiClient } from 'integra-client-sdk/rest';
import { defineLogicFunction } from 'integra-sdk/define';
import { type DatabaseEventPayload } from 'integra-sdk/logic-function';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { type RegistroIntegraCore } from 'src/modules/financeiro/types/registro-integracore';
import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';
import { normalizarVenda } from 'src/modules/financeiro/utils/normalizar-venda.util';
import { sincronizarLancamentoVenda } from 'src/modules/financeiro/utils/sincronizar-lancamento-venda.util';
import { OBJECTS } from 'src/modules/shared/constants/objects';

type EventoVenda = {
  recordId: string;
  properties: {
    after?: Partial<RegistroIntegraCore> | null;
    updatedFields?: string[];
  };
};

const ACOES_TRATADAS = ['created', 'updated', 'upserted'];

const handler = async (evento: DatabaseEventPayload<EventoVenda>) => {
  const acao = evento.name?.split('.').pop() ?? '';
  const depois = evento.properties?.after;
  const camposAlterados = evento.properties?.updatedFields;

  if (!ACOES_TRATADAS.includes(acao) || !depois) {
    return { resultado: 'IGNORADO' };
  }

  if (
    acao === 'updated' &&
    Array.isArray(camposAlterados) &&
    camposAlterados.length > 0 &&
    !camposAlterados.some((campo) =>
      ['status', 'valor', 'valorLiquido'].includes(campo),
    )
  ) {
    return { resultado: 'IGNORADO' };
  }

  const venda = normalizarVenda({
    ...depois,
    id: depois.id ?? evento.recordId,
  } as RegistroIntegraCore);
  const resultado = await sincronizarLancamentoVenda(
    new RestApiClient({ runAs: 'application' }),
    venda,
    hojeIso(),
  );

  console.log('[financeiro] venda processada', {
    vendaId: venda.id,
    status: venda.status,
    resultado,
  });

  return { resultado };
};

export default defineLogicFunction({
  universalIdentifier: FINANCEIRO_IDS.LOGIC_VENDA_LANCAMENTOS,
  name: 'financeiro-lancamento-de-venda',
  description:
    'Quando uma venda é aprovada cria a entrada no financeiro; quando é reembolsada ou sofre chargeback cria a saída de estorno (sem duplicar).',
  timeoutSeconds: 30,
  handler,
  eventTriggerSettings: {
    on: 'recordEvent',
    objectUniversalIdentifier: OBJECTS.venda.universalIdentifier,
    action: '*',
  },
});
