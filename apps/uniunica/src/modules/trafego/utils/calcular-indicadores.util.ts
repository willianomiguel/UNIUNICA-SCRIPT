import { type IndicadoresTrafego } from 'src/modules/trafego/types/indicadores-trafego';
import { type TotaisMetricas } from 'src/modules/trafego/types/totais-metricas';
import { calcularCpa } from 'src/modules/trafego/utils/calcular-cpa.util';
import { calcularCpc } from 'src/modules/trafego/utils/calcular-cpc.util';
import { calcularCpl } from 'src/modules/trafego/utils/calcular-cpl.util';
import { calcularCpm } from 'src/modules/trafego/utils/calcular-cpm.util';
import { calcularCtr } from 'src/modules/trafego/utils/calcular-ctr.util';
import { calcularRoas } from 'src/modules/trafego/utils/calcular-roas.util';

// Vendas reais (aprovadas) têm prioridade sobre as conversões informadas pela plataforma no CPA.
export const calcularIndicadores = ({
  totais,
  receita,
  vendas,
}: {
  totais: TotaisMetricas;
  receita: number;
  vendas: number;
}): IndicadoresTrafego => {
  const aquisicoes = vendas > 0 ? vendas : totais.conversoes;

  return {
    ctr: calcularCtr(totais.cliques, totais.impressoes),
    cpc: calcularCpc(totais.gasto, totais.cliques),
    cpm: calcularCpm(totais.gasto, totais.impressoes),
    cpl: calcularCpl(totais.gasto, totais.leads),
    cpa: calcularCpa(totais.gasto, aquisicoes),
    roas: calcularRoas(receita, totais.gasto),
  };
};
