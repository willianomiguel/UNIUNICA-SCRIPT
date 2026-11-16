import { dividirSeguro } from 'src/modules/trafego/utils/dividir-seguro.util';

// CPA (R$) = gasto / aquisições (vendas aprovadas, ou conversões quando não há vendas ligadas)
export const calcularCpa = (gasto: number, aquisicoes: number): number | null =>
  dividirSeguro(gasto, aquisicoes);
