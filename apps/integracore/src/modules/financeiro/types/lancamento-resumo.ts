import { type Recorrencia } from 'src/modules/financeiro/types/recorrencia';
import { type StatusLancamento } from 'src/modules/financeiro/types/status-lancamento';
import { type TipoLancamento } from 'src/modules/financeiro/types/tipo-lancamento';

// Lançamento já normalizado (valor em reais, datas YYYY-MM-DD).
export type LancamentoResumo = {
  id: string;
  descricao: string;
  tipo: TipoLancamento;
  valor: number;
  data: string | null;
  vencimento: string | null;
  status: StatusLancamento;
  recorrencia: Recorrencia;
  centroCusto: string | null;
  categoriaId: string | null;
};
