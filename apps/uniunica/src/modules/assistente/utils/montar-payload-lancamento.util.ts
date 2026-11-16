import { MARCA_OBSERVACAO_ASSISTENTE, ORIGEM_LANCAMENTO_ASSISTENTE } from 'src/modules/assistente/constants/assistente-opcoes-lancamento';
import { type EntradaLancar } from 'src/modules/assistente/types/entrada-lancar';
import { type LancamentoAssistentePayload } from 'src/modules/assistente/types/lancamento-assistente-payload';
import { reaisParaMicros } from 'src/modules/financeiro/utils/reais-para-micros.util';

// Corpo do POST /rest/lancamentos. O valor sai de centavos inteiros (nunca de float acumulado).
export const montarPayloadLancamento = (
  entrada: EntradaLancar,
  categoriaId: string | null,
): LancamentoAssistentePayload => ({
  descricao: entrada.descricao,
  tipo: entrada.tipo,
  valor: { amountMicros: reaisParaMicros(entrada.valorCentavos / 100), currencyCode: 'BRL' },
  data: entrada.data,
  vencimento: entrada.vencimento ?? entrada.data,
  status: entrada.status,
  recorrencia: 'NENHUMA',
  origem: ORIGEM_LANCAMENTO_ASSISTENTE,
  formaPagamento: entrada.formaPagamento,
  observacoes: [entrada.observacoes, MARCA_OBSERVACAO_ASSISTENTE].filter(Boolean).join(' '),
  categoriaId,
});
