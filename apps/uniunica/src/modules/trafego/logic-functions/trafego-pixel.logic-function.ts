import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { Response } from 'twenty-sdk/logic-function';

import { PIXEL_LOGIC_FUNCTION_ID } from 'src/modules/trafego/constants/trafego-universal-identifiers';
import { registrarEventoPixel } from 'src/modules/trafego/services/registrar-evento-pixel.service';
import { parsearEventoPixel } from 'src/modules/trafego/utils/parsear-evento-pixel.util';

const SEM_CACHE = { 'cache-control': 'no-store' };

// GET/POST <getServerRouteUrl(PIXEL_LOGIC_FUNCTION_ID)>?pagina=/oferta&tipo=visita&utm_campaign=…
export const trafegoPixelHandler = async (payload: RoutePayload<unknown>) => {
  const evento = parsearEventoPixel({
    headers: payload.headers,
    queryStringParameters: payload.queryStringParameters,
    body: payload.body ?? payload.rawBody,
  });

  if (!evento) {
    return new Response(
      { ok: false, erro: 'Informe o parâmetro "pagina".' },
      { status: 400, headers: SEM_CACHE },
    );
  }

  try {
    const resultado = await registrarEventoPixel(evento);

    return new Response({ ok: true, ...resultado }, { headers: SEM_CACHE });
  } catch (erro) {
    return new Response(
      { ok: false, erro: erro instanceof Error ? erro.message : String(erro) },
      { status: 500, headers: SEM_CACHE },
    );
  }
};

export default defineLogicFunction({
  universalIdentifier: PIXEL_LOGIC_FUNCTION_ID,
  name: 'trafego-pixel',
  description:
    'Pixel público do site: soma visitas/cliques do dia por página (origem Site), com utm_campaign opcional.',
  timeoutSeconds: 30,
  handler: trafegoPixelHandler,
  serverRouteTriggerSettings: {
    httpMethods: ['GET', 'POST'],
    forwardedRequestHeaders: ['referer'],
  },
});
