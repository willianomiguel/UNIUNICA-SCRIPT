import { dividirSeguro } from 'src/modules/trafego/utils/dividir-seguro.util';

// CPL (R$) = gasto / leads
export const calcularCpl = (gasto: number, leads: number): number | null =>
  dividirSeguro(gasto, leads);
