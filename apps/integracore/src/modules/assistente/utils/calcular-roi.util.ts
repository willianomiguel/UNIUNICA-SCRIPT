import { dividirSeguro } from 'src/modules/trafego/utils/dividir-seguro.util';

// ROI = (receita - gasto) / gasto, em fração (0,5 = 50%). null quando o gasto é zero:
// nunca divide por zero.
export const calcularRoi = (receita: number, gasto: number): number | null =>
  dividirSeguro(receita - gasto, gasto);
