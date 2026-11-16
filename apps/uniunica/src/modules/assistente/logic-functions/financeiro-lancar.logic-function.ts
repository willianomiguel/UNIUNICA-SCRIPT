import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';

import { ASSISTENTE_UNIVERSAL_IDENTIFIERS } from 'src/modules/assistente/constants/assistente-universal-identifiers';
import { financeiroLancarInputSchema } from 'src/modules/assistente/schemas/assistente-input.schema';
import { lancarLancamento } from 'src/modules/assistente/services/lancar-lancamento.service';
import { validarEntradaLancar } from 'src/modules/assistente/utils/validar-entrada-lancar.util';
import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';

const handler = async (input: unknown) => {
  try {
    const entrada = validarEntradaLancar(input, hojeIso());

    if (!entrada.ok) {
      return { ok: false, erro: entrada.erro };
    }

    return lancarLancamento(new RestApiClient(), entrada.valor);
  } catch (erro) {
    console.error('[assistente] financeiro-lancar:', erro instanceof Error ? erro.message : 'erro desconhecido');

    return { ok: false, erro: 'Falha ao consultar financeiro. Tente de novo.' };
  }
};

export default defineLogicFunction({
  universalIdentifier: ASSISTENTE_UNIVERSAL_IDENTIFIERS.logicFunctions.financeiroLancar,
  name: 'financeiro_lancar',
  description:
    'Cria um lançamento financeiro (receita ou despesa) já com categoria, convertendo o valor de reais para o formato do sistema. Use quando o usuário pedir para registrar/lançar um gasto ou recebimento ("lança R$ 89,90 de Notion em Ferramentas"). Se a categoria não existir, devolve ok:false com a lista de categorias: pergunte ao usuário qual usar. Confirme os dados com o usuário se algo essencial (valor, tipo) estiver ambíguo.',
  timeoutSeconds: 30,
  handler,
  toolTriggerSettings: { inputSchema: financeiroLancarInputSchema },
});
