import { RestApiClient } from 'integra-client-sdk/rest';
import { defineLogicFunction } from 'integra-sdk/define';

import { ASSISTENTE_UNIVERSAL_IDENTIFIERS } from 'src/modules/assistente/constants/assistente-universal-identifiers';
import { vendasResumoInputSchema } from 'src/modules/assistente/schemas/assistente-input.schema';
import { obterResumoVendas } from 'src/modules/assistente/services/obter-resumo-vendas.service';
import { validarPeriodo } from 'src/modules/assistente/utils/validar-periodo.util';
import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';

const handler = async (input: unknown) => {
  try {
    const periodo = validarPeriodo(input, hojeIso(), { tipo: 'MES_ATE_HOJE' });

    if (!periodo.ok) {
      return { ok: false, erro: periodo.erro };
    }

    const resumo = await obterResumoVendas(new RestApiClient(), periodo.valor);

    return { ok: true, ...resumo };
  } catch (erro) {
    console.error('[assistente] vendas-resumo:', erro instanceof Error ? erro.message : 'erro desconhecido');

    return { ok: false, erro: 'Falha ao consultar vendas. Tente de novo.' };
  }
};

export default defineLogicFunction({
  universalIdentifier: ASSISTENTE_UNIVERSAL_IDENTIFIERS.logicFunctions.vendasResumo,
  name: 'vendas_resumo',
  description:
    'Resumo de vendas de um período (padrão: mês atual até hoje): faturamento bruto e líquido, quantidade aprovada, ticket médio, reembolsos e chargebacks, variação contra o período anterior de mesma duração e quebra por gateway. Use para "quanto vendemos?", "como foi a semana?", "estamos melhor que o mês passado?".',
  timeoutSeconds: 30,
  handler,
  toolTriggerSettings: { inputSchema: vendasResumoInputSchema },
});
