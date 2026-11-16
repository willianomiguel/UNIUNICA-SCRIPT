import { type IndicadoresTrafego } from 'src/modules/trafego/types/indicadores-trafego';
import { type TotaisMetricas } from 'src/modules/trafego/types/totais-metricas';

export type LinhaPainelCampanha = {
  campanhaId: string | null;
  nome: string;
  plataforma: string | null;
  status: string | null;
  totais: TotaisMetricas;
  receita: number;
  vendas: number;
  indicadores: IndicadoresTrafego;
};
