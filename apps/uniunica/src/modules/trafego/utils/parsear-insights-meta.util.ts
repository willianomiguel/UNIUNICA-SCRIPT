import {
  META_ACOES_CONVERSAO,
  META_ACOES_LEAD,
  META_ACOES_VISITA,
} from 'src/modules/trafego/constants/trafego-constantes';
import { type MetaInsightLinha } from 'src/modules/trafego/types/meta-insight-linha';
import { type ResultadoParseMetricas } from 'src/modules/trafego/types/resultado-parse-metricas';
import { extrairAcaoMeta } from 'src/modules/trafego/utils/extrair-acao-meta.util';
import { montarChaveMetrica } from 'src/modules/trafego/utils/montar-chave-metrica.util';
import { normalizarData } from 'src/modules/trafego/utils/normalizar-data.util';
import { paraNumero } from 'src/modules/trafego/utils/para-numero.util';

// Converte a resposta de /insights (level=campaign, time_increment=1) em métricas diárias.
export const parsearInsightsMeta = (resposta: unknown): ResultadoParseMetricas => {
  const dados =
    typeof resposta === 'object' && resposta !== null
      ? (resposta as { data?: unknown }).data
      : undefined;

  if (!Array.isArray(dados)) {
    return { metricas: [], erros: ['Resposta do Meta sem a lista "data".'] };
  }

  const erros: string[] = [];
  const metricas: ResultadoParseMetricas['metricas'] = [];

  (dados as MetaInsightLinha[]).forEach((linha, indice) => {
    const data = normalizarData(linha?.date_start);
    const idCampanha = linha?.campaign_id ? String(linha.campaign_id) : undefined;

    if (!data || !idCampanha) {
      erros.push(`Linha ${indice + 1} do Meta sem date_start ou campaign_id.`);

      return;
    }

    const cliquesLink = paraNumero(linha.inline_link_clicks);

    metricas.push({
      chave: montarChaveMetrica({ origem: 'META_ADS', referencia: idCampanha, data }),
      data,
      origem: 'META_ADS',
      impressoes: Math.round(paraNumero(linha.impressions)),
      cliques: Math.round(cliquesLink > 0 ? cliquesLink : paraNumero(linha.clicks)),
      visitas: extrairAcaoMeta(linha.actions, META_ACOES_VISITA),
      leads: extrairAcaoMeta(linha.actions, META_ACOES_LEAD),
      conversoes: extrairAcaoMeta(linha.actions, META_ACOES_CONVERSAO),
      gasto: paraNumero(linha.spend),
      pagina: null,
      campanha: { idExterno: idCampanha, nome: linha.campaign_name ?? undefined },
    });
  });

  return { metricas, erros };
};
