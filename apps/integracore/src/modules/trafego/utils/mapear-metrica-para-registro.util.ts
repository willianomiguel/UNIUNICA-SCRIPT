import { type MetricaNormalizada } from 'src/modules/trafego/types/metrica-normalizada';
import { montarNomeMetrica } from 'src/modules/trafego/utils/montar-nome-metrica.util';
import { reaisParaMicros } from 'src/modules/trafego/utils/reais-para-micros.util';

// Dados de create/update do objeto metricaTrafego.
export const mapearMetricaParaRegistro = (
  metrica: MetricaNormalizada,
  campanha: { id: string; nome: string | null } | null,
): Record<string, unknown> => ({
  nome: montarNomeMetrica(metrica, campanha?.nome),
  data: metrica.data,
  origem: metrica.origem,
  impressoes: metrica.impressoes,
  cliques: metrica.cliques,
  visitas: metrica.visitas,
  leads: metrica.leads,
  conversoes: metrica.conversoes,
  gasto: { amountMicros: reaisParaMicros(metrica.gasto), currencyCode: 'BRL' },
  pagina: metrica.pagina,
  chave: metrica.chave,
  ...(campanha ? { campanhaId: campanha.id } : {}),
});
