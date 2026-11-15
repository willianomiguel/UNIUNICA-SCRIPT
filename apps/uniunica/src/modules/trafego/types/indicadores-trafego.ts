// null quando o denominador é zero (sem dado suficiente para calcular).
export type IndicadoresTrafego = {
  ctr: number | null;
  cpc: number | null;
  cpm: number | null;
  cpl: number | null;
  cpa: number | null;
  roas: number | null;
};
