import { defineLogicFunction } from 'integra-sdk/define';
import { type RoutePayload } from 'integra-sdk/logic-function';

import { LIMITE_ITENS_LOTE } from 'src/modules/vendas/constants/limite-itens-lote';
import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';
import { type ResultadoProcessamento } from 'src/modules/vendas/types/resultado-processamento';
import { extrairItensLote } from 'src/modules/vendas/utils/extrair-itens-lote.util';
import { lerFormatoImportacao } from 'src/modules/vendas/utils/ler-formato-importacao.util';
import { normalizarPorFormato } from 'src/modules/vendas/utils/normalizar-por-formato.util';
import { respostaJson } from 'src/modules/vendas/utils/resposta-json.util';
import { processarEventoPagamento } from 'src/modules/vendas/vendas-client/processar-evento-pagamento';

// Authenticated with a IntegraCore API key (Authorization: Bearer). See the module README for the format.
const handler = async (event: RoutePayload) => {
  const formato = lerFormatoImportacao(event.queryStringParameters?.formato);

  if (formato === null) {
    return respostaJson(400, {
      erro: 'Parâmetro "formato" inválido. Use generico, stripe, mercado_pago, asaas ou pagarme.',
    });
  }

  const itens = extrairItensLote(event.body);

  if (itens.length === 0) {
    return respostaJson(400, { erro: 'Corpo vazio ou inválido: envie um objeto JSON.' });
  }

  if (itens.length > LIMITE_ITENS_LOTE) {
    return respostaJson(413, { erro: `Envie no máximo ${LIMITE_ITENS_LOTE} vendas por requisição.` });
  }

  const resultados: ResultadoProcessamento[] = [];

  for (const item of itens) {
    const { gateway, resultado } = normalizarPorFormato(formato, item);

    resultados.push(
      await processarEventoPagamento({ gateway, payload: item, normalizar: () => resultado }),
    );
  }

  const falhas = resultados.filter((resultado) => !resultado.ok).length;
  const corpo =
    resultados.length === 1
      ? resultados[0]
      : {
          ok: falhas === 0,
          total: resultados.length,
          processadas: resultados.filter((resultado) => resultado.vendaId !== null).length,
          ignoradas: resultados.filter((resultado) => resultado.ignorado).length,
          falhas,
          resultados,
        };

  return respostaJson(falhas === 0 ? 200 : 500, corpo);
};

export default defineLogicFunction({
  universalIdentifier: VENDAS_IDS.logicFunctions.webhookGenerico,
  name: 'vendas-webhook-generico',
  description:
    'Recebe vendas no formato JSON genérico (ou eventos de gateway para importação), autenticado por chave de API do IntegraCore.',
  timeoutSeconds: 120,
  handler,
  httpRouteTriggerSettings: {
    path: '/vendas/webhook/generico',
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
