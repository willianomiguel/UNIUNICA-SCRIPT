export type LinhaDesempenhoTrafego = {
  campanhaId: string | null;
  nome: string;
  plataforma: string | null;
  gasto: number;
  receita: number;
  vendas: number;
  roas: number | null;
  // (receita - gasto) / gasto; null quando o gasto é zero.
  roi: number | null;
  cpa: number | null;
};
