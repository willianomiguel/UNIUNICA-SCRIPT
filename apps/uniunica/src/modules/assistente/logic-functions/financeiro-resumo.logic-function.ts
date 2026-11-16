import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';

import { ASSISTENTE_UNIVERSAL_IDENTIFIERS } from 'src/modules/assistente/constants/assistente-universal-identifiers';
import { financeiroResumoInputSchema } from 'src/modules/assistente/schemas/assistente-input.schema';
import { obterResumoFinanceiro } from 'src/modules/assistente/services/obter-resumo-financeiro.service';
import { validarPeriodo } from 'src/modules/assistente/utils/validar-periodo.util';
import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';

const handler = async (input: unknown) => {
  try {
    const hoje = hojeIso();
    const periodo = validarPeriodo(input, hoje, { tipo: 'MES_COMPLETO' });

    if (!periodo.ok) {
      return { ok: false, erro: periodo.erro };
    }

    const resumo = await obterResumoFinanceiro(new RestApiClient(), periodo.valor, hoje);

    return { ok: true, ...resumo };
  } catch (erro) {
    console.error('[assistente] financeiro-resumo:', erro instanceof Error ? erro.message : 'erro desconhecido');

    return { ok: false, erro: 'Falha ao consultar financeiro. Tente de novo.' };
  }
};

export default defineLogicFunction({
  universalIdentifier: ASSISTENTE_UNIVERSAL_IDENTIFIERS.logicFunctions.financeiroResumo,
  name: 'financeiro_resumo',
  description:
    'Resumo financeiro de um período (padrão: mês atual): receitas, despesas e saldo realizados (pagos) e previstos, total a receber e a pagar em aberto, quantidade e valor de lançamentos atrasados e as 5 maiores categorias de despesa. Use para perguntas como "quanto gastamos este mês?", "como está o caixa?", "o que está atrasado?".',
  timeoutSeconds: 30,
  handler,
  toolTriggerSettings: { inputSchema: financeiroResumoInputSchema },
});
