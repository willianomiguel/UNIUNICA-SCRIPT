import { defineLogicFunction } from 'twenty-sdk/define';

import { ASSISTENTE_UNIVERSAL_IDENTIFIERS } from 'src/modules/assistente/constants/assistente-universal-identifiers';
import { trafegoDesempenhoInputSchema } from 'src/modules/assistente/schemas/assistente-input.schema';
import { obterDesempenhoTrafego } from 'src/modules/assistente/services/obter-desempenho-trafego.service';
import { validarEntradaTrafego } from 'src/modules/assistente/utils/validar-entrada-trafego.util';
import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';

const handler = async (input: unknown) => {
  try {
    const entrada = validarEntradaTrafego(input, hojeIso());

    if (!entrada.ok) {
      return { ok: false, erro: entrada.erro };
    }

    const desempenho = await obterDesempenhoTrafego(entrada.valor.intervalo, entrada.valor.campanha);

    return { ok: true, ...desempenho };
  } catch (erro) {
    console.error('[assistente] trafego-desempenho:', erro instanceof Error ? erro.message : 'erro desconhecido');

    return { ok: false, erro: 'Falha ao consultar tráfego. Tente de novo.' };
  }
};

export default defineLogicFunction({
  universalIdentifier: ASSISTENTE_UNIVERSAL_IDENTIFIERS.logicFunctions.trafegoDesempenho,
  name: 'trafego_desempenho',
  description:
    'Desempenho do tráfego pago (padrão: últimos 30 dias), no total e por campanha: gasto, receita atribuída (vendas aprovadas ligadas à campanha), ROAS, ROI, CPA e vendas. Os números são os mesmos do Painel de Tráfego. Use para "qual campanha dá mais retorno?", "quanto gastamos em anúncios?". ROI e ROAS vêm null quando não houve gasto.',
  timeoutSeconds: 30,
  handler,
  toolTriggerSettings: { inputSchema: trafegoDesempenhoInputSchema },
});
