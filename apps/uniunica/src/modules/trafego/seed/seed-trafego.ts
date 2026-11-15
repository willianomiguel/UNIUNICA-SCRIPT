import { CAMPANHAS_EXEMPLO } from 'src/modules/trafego/constants/campanhas-exemplo';
import { criarCampanha } from 'src/modules/trafego/services/criar-campanha.service';
import { listarCampanhas } from 'src/modules/trafego/services/listar-campanhas.service';
import { upsertMetricas } from 'src/modules/trafego/services/upsert-metricas.service';
import { dataNoFuso } from 'src/modules/trafego/utils/data-no-fuso.util';
import { gerarMetricasExemplo } from 'src/modules/trafego/utils/gerar-metricas-exemplo.util';
import { reaisParaMicros } from 'src/modules/trafego/utils/reais-para-micros.util';
import { somarDias } from 'src/modules/trafego/utils/somar-dias.util';

const DIAS_DE_METRICAS = 14;

// Cria 2 campanhas de exemplo com 14 dias de métricas. Idempotente: pula campanhas que já existem.
const seedTrafego = async (): Promise<void> => {
  const existentes = await listarCampanhas();
  const hoje = dataNoFuso(new Date());

  for (const exemplo of CAMPANHAS_EXEMPLO) {
    if (existentes.some((campanha) => campanha.idExterno === exemplo.idExterno)) {
      continue;
    }

    await criarCampanha({
      nome: exemplo.nome,
      plataforma: exemplo.plataforma,
      status: exemplo.status,
      objetivo: exemplo.objetivo,
      orcamento: { amountMicros: reaisParaMicros(exemplo.orcamento), currencyCode: 'BRL' },
      dataInicio: somarDias(hoje, -DIAS_DE_METRICAS),
      dataFim: somarDias(hoje, 16),
      utmCampaign: exemplo.utmCampaign,
      idExterno: exemplo.idExterno,
      link: { primaryLinkUrl: exemplo.link, primaryLinkLabel: '' },
    });

    await upsertMetricas(
      gerarMetricasExemplo({
        idExterno: exemplo.idExterno,
        origem: exemplo.origem,
        base: exemplo.base,
        hoje,
        dias: DIAS_DE_METRICAS,
      }),
      { criarCampanhas: false },
    );
  }
};

export default seedTrafego;
