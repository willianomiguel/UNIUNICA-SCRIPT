import { dividirSeguro } from 'src/modules/trafego/utils/dividir-seguro.util';

// CTR (%) = cliques / impressões × 100
export const calcularCtr = (cliques: number, impressoes: number): number | null => {
  const taxa = dividirSeguro(cliques, impressoes);

  return taxa === null ? null : taxa * 100;
};
