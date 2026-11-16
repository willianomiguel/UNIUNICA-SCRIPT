import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';
import { type Recorrencia } from 'src/modules/financeiro/types/recorrencia';
import { type RegistroIntegraCore } from 'src/modules/financeiro/types/registro-integracore';
import { type StatusLancamento } from 'src/modules/financeiro/types/status-lancamento';
import { microsParaReais } from 'src/modules/financeiro/utils/micros-para-reais.util';

const texto = (valor: unknown): string | null =>
  typeof valor === 'string' && valor.length > 0 ? valor : null;

// Converte um registro cru da API REST em LancamentoResumo.
export const normalizarLancamento = (
  registro: RegistroIntegraCore,
): LancamentoResumo => {
  const valor = registro.valor as { amountMicros?: unknown } | null | undefined;

  return {
    id: registro.id,
    descricao: texto(registro.descricao) ?? '',
    tipo: registro.tipo === 'ENTRADA' ? 'ENTRADA' : 'SAIDA',
    valor: Math.abs(microsParaReais(valor?.amountMicros)),
    data: texto(registro.data)?.slice(0, 10) ?? null,
    vencimento: texto(registro.vencimento)?.slice(0, 10) ?? null,
    status: (texto(registro.status) ?? 'PENDENTE') as StatusLancamento,
    recorrencia: (texto(registro.recorrencia) ?? 'NENHUMA') as Recorrencia,
    centroCusto: texto(registro.centroCusto),
    categoriaId: texto(registro.categoriaId),
  };
};
