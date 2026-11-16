import { defineLogicFunction } from 'integra-sdk/define';

import {
  FUSO_HORARIO_PADRAO,
  META_DIAS_REPROCESSAR,
} from 'src/modules/trafego/constants/trafego-constantes';
import { META_ADS_SYNC_LOGIC_FUNCTION_ID } from 'src/modules/trafego/constants/trafego-universal-identifiers';
import { buscarInsightsMeta } from 'src/modules/trafego/services/buscar-insights-meta.service';
import { upsertMetricas } from 'src/modules/trafego/services/upsert-metricas.service';
import { dataNoFuso } from 'src/modules/trafego/utils/data-no-fuso.util';
import { normalizarIdContaMeta } from 'src/modules/trafego/utils/normalizar-id-conta-meta.util';
import { parsearInsightsMeta } from 'src/modules/trafego/utils/parsear-insights-meta.util';
import { somarDias } from 'src/modules/trafego/utils/somar-dias.util';

// Puxa gasto/impressões/cliques/leads por campanha e dia do Meta Ads (últimos dias + hoje).
export const metaAdsSyncHandler = async () => {
  const token = (process.env.META_ADS_ACCESS_TOKEN ?? '').trim();
  const idConta = normalizarIdContaMeta(process.env.META_ADS_ACCOUNT_ID);

  if (!token || !idConta) {
    return {
      status: 'IGNORADO',
      motivo:
        'Configure META_ADS_ACCESS_TOKEN e META_ADS_ACCOUNT_ID nas variáveis do app para sincronizar o Meta Ads.',
    };
  }

  const ate = dataNoFuso(new Date(), FUSO_HORARIO_PADRAO);
  const desde = somarDias(ate, -META_DIAS_REPROCESSAR);
  const resposta = await buscarInsightsMeta({ token, idConta, desde, ate });
  const { metricas, erros } = parsearInsightsMeta(resposta);
  const resultado = await upsertMetricas(metricas, { criarCampanhas: true });

  return { status: 'OK', desde, ate, linhas: metricas.length, ...resultado, erros };
};

export default defineLogicFunction({
  universalIdentifier: META_ADS_SYNC_LOGIC_FUNCTION_ID,
  name: 'trafego-meta-ads-sync',
  description:
    'Diariamente busca os Insights do Meta Ads (nível campanha, por dia) e atualiza Métricas de tráfego. Ignora se as variáveis não estiverem configuradas.',
  timeoutSeconds: 300,
  handler: metaAdsSyncHandler,
  // 09:17 UTC = 06:17 em Brasília
  cronTriggerSettings: { pattern: '17 9 * * *' },
});
