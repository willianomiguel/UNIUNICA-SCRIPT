import { type OrigemMetrica } from 'src/modules/trafego/types/origem-metrica';
import { type ReferenciaCampanha } from 'src/modules/trafego/types/referencia-campanha';

// Uma linha diária pronta para gravar em metricaTrafego. gasto em reais (não micros).
export type MetricaNormalizada = {
  chave: string;
  data: string;
  origem: OrigemMetrica;
  impressoes: number;
  cliques: number;
  visitas: number;
  leads: number;
  conversoes: number;
  gasto: number;
  pagina: string | null;
  campanha: ReferenciaCampanha | null;
};
