import { dividirSeguro } from 'src/modules/trafego/utils/dividir-seguro.util';

// CPC (R$) = gasto / cliques
export const calcularCpc = (gasto: number, cliques: number): number | null =>
  dividirSeguro(gasto, cliques);
