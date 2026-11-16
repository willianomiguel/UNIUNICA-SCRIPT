import { definePostInstallLogicFunction } from 'integra-sdk/define';

import { DADOS_INICIAIS_POST_INSTALL_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { executarSeeds } from 'src/logic-functions/utils/executar-seeds.util';
import { SEEDS_DOS_MODULOS } from 'src/logic-functions/utils/seeds-dos-modulos.util';

export default definePostInstallLogicFunction({
  universalIdentifier: DADOS_INICIAIS_POST_INSTALL_UNIVERSAL_IDENTIFIER,
  name: 'dados-iniciais',
  description:
    'Cria os dados estruturais do app (categorias financeiras padrão). Não cria dados de exemplo. Idempotente.',
  timeoutSeconds: 300,
  shouldRunOnVersionUpgrade: false,
  shouldRunSynchronously: false,
  handler: async () => ({ resultados: await executarSeeds(SEEDS_DOS_MODULOS) }),
});
