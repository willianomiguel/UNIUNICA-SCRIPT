import { type LancamentoPayload } from 'src/modules/financeiro/types/lancamento-payload';
import { type Recorrencia } from 'src/modules/financeiro/types/recorrencia';
import { type RegistroTwenty } from 'src/modules/financeiro/types/registro-twenty';
import { calcularProximaRecorrencia } from 'src/modules/financeiro/utils/calcular-proxima-recorrencia.util';

const texto = (valor: unknown): string | null =>
  typeof valor === 'string' && valor.length > 0 ? valor : null;

const diferencaEmDias = (de: string, ate: string): number =>
  Math.round((Date.parse(ate) - Date.parse(de)) / 86_400_000);

const somarDias = (data: string, dias: number): string =>
  new Date(Date.parse(data) + dias * 86_400_000).toISOString().slice(0, 10);

// Monta a próxima ocorrência de um lançamento recorrente (ou null se não houver).
// O vencimento mantém a mesma distância em dias da data, e o dia da série vem
// da data do primeiro lançamento (`dataRaiz`), para não perder dias 29–31.
export const montarProximaOcorrencia = (
  registro: RegistroTwenty,
  dataRaiz?: string | null,
): LancamentoPayload | null => {
  const recorrencia = (texto(registro.recorrencia) ?? 'NENHUMA') as Recorrencia;
  const data = texto(registro.data)?.slice(0, 10) ?? null;
  const vencimento = texto(registro.vencimento)?.slice(0, 10) ?? null;
  const referencia = data ?? vencimento;

  if (recorrencia === 'NENHUMA' || referencia === null) {
    return null;
  }

  const diaAncora = dataRaiz ? Number(dataRaiz.slice(8, 10)) : undefined;
  const proximaReferencia = calcularProximaRecorrencia(
    referencia,
    recorrencia,
    diaAncora,
  );

  if (proximaReferencia === null) {
    return null;
  }

  const raizId = texto(registro.recorrenciaRaizId) ?? registro.id;
  const valor = registro.valor as
    | { amountMicros?: unknown; currencyCode?: unknown }
    | null
    | undefined;

  return {
    descricao: texto(registro.descricao) ?? 'Lançamento recorrente',
    tipo: texto(registro.tipo) ?? 'SAIDA',
    valor: {
      amountMicros: Number(valor?.amountMicros ?? 0) || 0,
      currencyCode: texto(valor?.currencyCode) ?? 'BRL',
    },
    data: data === null ? null : proximaReferencia,
    vencimento:
      vencimento === null
        ? null
        : data === null
          ? proximaReferencia
          : somarDias(proximaReferencia, diferencaEmDias(data, vencimento)),
    status: 'PENDENTE',
    recorrencia,
    origem: 'RECORRENCIA',
    chaveIdempotencia: `recorrencia:${raizId}:${proximaReferencia}`,
    formaPagamento: texto(registro.formaPagamento),
    centroCusto: texto(registro.centroCusto),
    observacoes: texto(registro.observacoes),
    categoriaId: texto(registro.categoriaId),
    recorrenciaRaizId: raizId,
  };
};
