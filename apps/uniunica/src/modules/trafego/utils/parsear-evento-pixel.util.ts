import { type EventoPixel } from 'src/modules/trafego/types/evento-pixel';
import { type RequisicaoRota } from 'src/modules/trafego/types/requisicao-rota';
import { normalizarPagina } from 'src/modules/trafego/utils/normalizar-pagina.util';
import { normalizarUtm } from 'src/modules/trafego/utils/normalizar-utm.util';

const lerCorpo = (corpo: unknown): Record<string, unknown> => {
  if (typeof corpo === 'string') {
    try {
      const json = JSON.parse(corpo);

      return typeof json === 'object' && json !== null ? json : {};
    } catch {
      return Object.fromEntries(new URLSearchParams(corpo));
    }
  }

  return typeof corpo === 'object' && corpo !== null
    ? (corpo as Record<string, unknown>)
    : {};
};

// Lê pagina/tipo/utm_* da query string (GET) ou do corpo (POST/sendBeacon).
export const parsearEventoPixel = (requisicao: RequisicaoRota): EventoPixel | null => {
  const dados = {
    ...lerCorpo(requisicao.body),
    ...requisicao.queryStringParameters,
  } as Record<string, unknown>;

  const pagina =
    normalizarPagina(dados.pagina ?? dados.page ?? dados.url) ??
    normalizarPagina(requisicao.headers?.referer ?? requisicao.headers?.referrer);

  if (!pagina) {
    return null;
  }

  const tipoBruto = String(dados.tipo ?? dados.evento ?? 'visita').toLowerCase();

  return {
    pagina,
    tipo: tipoBruto.startsWith('cliq') || tipoBruto === 'click' ? 'CLIQUE' : 'VISITA',
    utmCampaign: normalizarUtm(dados.utm_campaign ?? dados.utmCampaign),
    utmSource: normalizarUtm(dados.utm_source ?? dados.utmSource),
    utmMedium: normalizarUtm(dados.utm_medium ?? dados.utmMedium),
  };
};
