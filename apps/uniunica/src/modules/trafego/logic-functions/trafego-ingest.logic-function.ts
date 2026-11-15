import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { Response } from 'twenty-sdk/logic-function';

import { INGEST_LOGIC_FUNCTION_ID } from 'src/modules/trafego/constants/trafego-universal-identifiers';
import { upsertMetricas } from 'src/modules/trafego/services/upsert-metricas.service';
import { lerCorpoJson } from 'src/modules/trafego/utils/ler-corpo-json.util';
import { parsearPayloadGenerico } from 'src/modules/trafego/utils/parsear-payload-generico.util';
import { tokenIngestaoValido } from 'src/modules/trafego/utils/token-ingestao-valido.util';

// POST <getServerRouteUrl(INGEST_LOGIC_FUNCTION_ID)> — recebe métricas diárias (formato no README).
export const trafegoIngestHandler = async (payload: RoutePayload<unknown>) => {
  if (!tokenIngestaoValido(payload, process.env.TRAFEGO_INGEST_TOKEN)) {
    return new Response(
      { ok: false, erro: 'Token inválido. Envie o cabeçalho x-trafego-token.' },
      { status: 401 },
    );
  }

  const { metricas, erros } = parsearPayloadGenerico(
    lerCorpoJson(payload.body ?? payload.rawBody),
  );

  if (metricas.length === 0) {
    return new Response({ ok: false, erros }, { status: 400 });
  }

  try {
    const resultado = await upsertMetricas(metricas, { criarCampanhas: true });

    return new Response({ ok: true, recebidas: metricas.length, ...resultado, erros });
  } catch (erro) {
    return new Response(
      { ok: false, erro: erro instanceof Error ? erro.message : String(erro) },
      { status: 500 },
    );
  }
};

export default defineLogicFunction({
  universalIdentifier: INGEST_LOGIC_FUNCTION_ID,
  name: 'trafego-ingest',
  description:
    'Endpoint público que recebe métricas diárias de tráfego (JSON genérico) e grava em Métricas de tráfego sem duplicar (upsert pela chave).',
  timeoutSeconds: 300,
  handler: trafegoIngestHandler,
  serverRouteTriggerSettings: {
    httpMethods: ['POST'],
    forwardedRequestHeaders: ['x-trafego-token'],
  },
});
