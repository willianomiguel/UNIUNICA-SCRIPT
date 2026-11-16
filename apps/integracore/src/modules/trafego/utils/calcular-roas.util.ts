import { dividirSeguro } from 'src/modules/trafego/utils/dividir-seguro.util';

// ROAS (×) = receita das vendas aprovadas / gasto
export const calcularRoas = (receita: number, gasto: number): number | null =>
  dividirSeguro(receita, gasto);
