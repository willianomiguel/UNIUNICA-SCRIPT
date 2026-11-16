import { type MetricaNormalizada } from 'src/modules/trafego/types/metrica-normalizada';
import { type OrigemMetrica } from 'src/modules/trafego/types/origem-metrica';
import { type ReferenciaCampanha } from 'src/modules/trafego/types/referencia-campanha';
import { type ResultadoParseMetricas } from 'src/modules/trafego/types/resultado-parse-metricas';
import { montarChaveMetrica } from 'src/modules/trafego/utils/montar-chave-metrica.util';
import { normalizarData } from 'src/modules/trafego/utils/normalizar-data.util';
import { normalizarOrigem } from 'src/modules/trafego/utils/normalizar-origem.util';
import { paraNumero } from 'src/modules/trafego/utils/para-numero.util';

const LIMITE_LINHAS = 2000;

type Objeto = Record<string, unknown>;

const ehObjeto = (valor: unknown): valor is Objeto =>
  typeof valor === 'object' && valor !== null && !Array.isArray(valor);

const texto = (valor: unknown): string | undefined => {
  if (typeof valor === 'number' && Number.isFinite(valor)) {
    return String(valor);
  }

  if (typeof valor !== 'string') {
    return undefined;
  }

  const limpo = valor.trim();

  return limpo === '' ? undefined : limpo;
};

const primeiro = (linha: Objeto, nomes: string[]): unknown =>
  nomes.map((nome) => linha[nome]).find((valor) => valor !== undefined && valor !== null);

const lerReferencia = (linha: Objeto): ReferenciaCampanha | null => {
  const aninhada = ehObjeto(linha.campanha) ? linha.campanha : {};
  const nomeSolto = typeof linha.campanha === 'string' ? linha.campanha : undefined;

  const referencia: ReferenciaCampanha = {
    id: texto(aninhada.id ?? linha.campanhaId),
    idExterno: texto(aninhada.idExterno ?? linha.idExterno ?? linha.campaignId ?? linha.campaign_id),
    utmCampaign: texto(aninhada.utmCampaign ?? linha.utmCampaign ?? linha.utm_campaign),
    nome: texto(aninhada.nome ?? linha.campanhaNome ?? linha.campaignName ?? linha.campaign_name ?? nomeSolto),
  };

  const definida = Object.fromEntries(
    Object.entries(referencia).filter(([, valor]) => valor !== undefined),
  ) as ReferenciaCampanha;

  return Object.keys(definida).length > 0 ? definida : null;
};

/**
 * Formato genérico aceito pelo endpoint de ingestão:
 * { "origem": "GOOGLE_ADS", "metricas": [ { "data": "2026-11-14", "campanha": { "idExterno": "123" },
 *   "impressoes": 1000, "cliques": 40, "visitas": 30, "leads": 4, "conversoes": 1, "gasto": 87.5 } ] }
 * Também aceita um array solto de linhas e apelidos em inglês (impressions, clicks, spend/cost…).
 */
export const parsearPayloadGenerico = (payload: unknown): ResultadoParseMetricas => {
  const erros: string[] = [];
  const raiz = ehObjeto(payload) ? payload : {};
  const linhas = Array.isArray(payload)
    ? payload
    : Array.isArray(raiz.metricas)
      ? raiz.metricas
      : Array.isArray(raiz.rows)
        ? raiz.rows
        : null;

  if (!linhas) {
    return {
      metricas: [],
      erros: ['Envie um JSON com a lista "metricas" (ou um array de linhas).'],
    };
  }

  if (linhas.length > LIMITE_LINHAS) {
    return {
      metricas: [],
      erros: [`Máximo de ${LIMITE_LINHAS} linhas por envio (recebidas ${linhas.length}).`],
    };
  }

  const origemPadrao: OrigemMetrica = normalizarOrigem(raiz.origem, 'MANUAL');
  const porChave = new Map<string, MetricaNormalizada>();

  linhas.forEach((linhaBruta: unknown, indice: number) => {
    if (!ehObjeto(linhaBruta)) {
      erros.push(`Linha ${indice + 1}: não é um objeto.`);

      return;
    }

    const linha = linhaBruta;
    const data = normalizarData(primeiro(linha, ['data', 'date', 'dia', 'date_start']));

    if (!data) {
      erros.push(`Linha ${indice + 1}: "data" ausente ou inválida (use AAAA-MM-DD).`);

      return;
    }

    const origem = normalizarOrigem(linha.origem, origemPadrao);
    const campanha = lerReferencia(linha);
    const pagina = texto(primeiro(linha, ['pagina', 'page', 'url'])) ?? null;
    const chave =
      texto(linha.chave) ??
      montarChaveMetrica({
        origem,
        referencia:
          campanha?.idExterno ?? campanha?.utmCampaign ?? campanha?.id ?? pagina ?? campanha?.nome,
        data,
      });

    porChave.set(chave, {
      chave,
      data,
      origem,
      impressoes: Math.round(paraNumero(primeiro(linha, ['impressoes', 'impressions']))),
      cliques: Math.round(paraNumero(primeiro(linha, ['cliques', 'clicks']))),
      visitas: Math.round(paraNumero(primeiro(linha, ['visitas', 'visits', 'sessions']))),
      leads: Math.round(paraNumero(primeiro(linha, ['leads']))),
      conversoes: Math.round(paraNumero(primeiro(linha, ['conversoes', 'conversions']))),
      gasto: paraNumero(primeiro(linha, ['gasto', 'spend', 'cost', 'custo'])),
      pagina,
      campanha,
    });
  });

  return { metricas: [...porChave.values()], erros };
};
