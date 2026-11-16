import { type CategoriaResumo } from 'src/modules/financeiro/types/categoria-resumo';
import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';

export type DadosFinanceiros = {
  lancamentos: LancamentoResumo[];
  categorias: CategoriaResumo[];
};
