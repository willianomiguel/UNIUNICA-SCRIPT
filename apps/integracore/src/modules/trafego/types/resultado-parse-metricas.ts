import { type MetricaNormalizada } from 'src/modules/trafego/types/metrica-normalizada';

export type ResultadoParseMetricas = {
  metricas: MetricaNormalizada[];
  erros: string[];
};
