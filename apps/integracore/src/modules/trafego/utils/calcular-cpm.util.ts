import { dividirSeguro } from 'src/modules/trafego/utils/dividir-seguro.util';

// CPM (R$) = gasto / impressões × 1000
export const calcularCpm = (gasto: number, impressoes: number): number | null => {
  const custo = dividirSeguro(gasto, impressoes);

  return custo === null ? null : custo * 1000;
};
