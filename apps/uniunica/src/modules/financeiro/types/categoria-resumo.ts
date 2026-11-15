import { type TipoLancamento } from 'src/modules/financeiro/types/tipo-lancamento';

export type CategoriaResumo = {
  id: string;
  nome: string;
  tipo: TipoLancamento;
  orcamentoMensal: number;
};
