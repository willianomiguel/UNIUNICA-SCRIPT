import { type LinhaValor } from 'src/modules/financeiro/types/linha-valor';

export type DreSimplificada = {
  mes: string;
  receita: number;
  receitasPorCategoria: LinhaValor[];
  custos: number;
  custosPorCategoria: LinhaValor[];
  custosPorCentroCusto: LinhaValor[];
  resultado: number;
  // Resultado / receita, em %; null quando não há receita.
  margem: number | null;
};
