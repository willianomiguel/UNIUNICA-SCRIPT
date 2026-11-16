import { type TipoLancamento } from 'src/modules/financeiro/types/tipo-lancamento';

export type OrcadoRealizadoLinha = {
  categoriaId: string;
  nome: string;
  tipo: TipoLancamento;
  orcado: number;
  realizado: number;
  diferenca: number;
  // Realizado / orçado, em %; null quando não há orçamento.
  percentual: number | null;
};
