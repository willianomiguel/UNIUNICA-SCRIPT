import { type MetricaNormalizada } from 'src/modules/trafego/types/metrica-normalizada';
import { type OrigemMetrica } from 'src/modules/trafego/types/origem-metrica';
import { type TotaisMetricas } from 'src/modules/trafego/types/totais-metricas';
import { montarChaveMetrica } from 'src/modules/trafego/utils/montar-chave-metrica.util';
import { somarDias } from 'src/modules/trafego/utils/somar-dias.util';

// Variação determinística (sem Math.random) para os dados de exemplo parecerem reais.
const FATORES = [0.82, 1.05, 0.94, 1.18, 1.27, 0.71, 0.66, 0.9, 1.12, 1.01, 1.33, 1.21, 0.88, 0.97];

export const gerarMetricasExemplo = ({
  idExterno,
  origem,
  base,
  hoje,
  dias,
}: {
  idExterno: string;
  origem: OrigemMetrica;
  base: TotaisMetricas;
  hoje: string;
  dias: number;
}): MetricaNormalizada[] =>
  Array.from({ length: dias }, (_, indice) => {
    const data = somarDias(hoje, indice - dias);
    const fator = FATORES[indice % FATORES.length];

    return {
      chave: montarChaveMetrica({ origem, referencia: idExterno, data }),
      data,
      origem,
      impressoes: Math.round(base.impressoes * fator),
      cliques: Math.round(base.cliques * fator),
      visitas: Math.round(base.visitas * fator),
      leads: Math.round(base.leads * fator),
      conversoes: Math.round(base.conversoes * fator),
      gasto: Math.round(base.gasto * fator * 100) / 100,
      pagina: null,
      campanha: { idExterno },
    };
  });
