import { defineLogicFunction } from 'integra-sdk/define';

import { DADOS_INICIAIS_ROTA_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { executarSeeds } from 'src/logic-functions/utils/executar-seeds.util';
import { SEEDS_DOS_MODULOS } from 'src/logic-functions/utils/seeds-dos-modulos.util';

// Mesmo conteúdo do post-install, mas acionável com uma chave de API:
// curl -X POST -H "Authorization: Bearer $CHAVE" $SERVER_URL/s/integracore/dados-iniciais
export default defineLogicFunction({
  universalIdentifier: DADOS_INICIAIS_ROTA_UNIVERSAL_IDENTIFIER,
  name: 'dados-iniciais-rota',
  description: 'Cria (ou completa) os dados iniciais de todos os módulos. Idempotente.',
  timeoutSeconds: 300,
  handler: async () => {
    const resultados = await executarSeeds(SEEDS_DOS_MODULOS);

    return { ok: resultados.every((resultado) => resultado.ok), resultados };
  },
  httpRouteTriggerSettings: {
    path: '/integracore/dados-iniciais',
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
