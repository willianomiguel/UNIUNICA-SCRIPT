import { definePostInstallLogicFunction } from 'twenty-sdk/define';

import { DADOS_INICIAIS_POST_INSTALL_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { executarSeeds } from 'src/logic-functions/utils/executar-seeds.util';
import { SEEDS_DOS_MODULOS } from 'src/logic-functions/utils/seeds-dos-modulos.util';

export default definePostInstallLogicFunction({
  universalIdentifier: DADOS_INICIAIS_POST_INSTALL_UNIVERSAL_IDENTIFIER,
  name: 'dados-iniciais',
  description:
    'Cria os dados iniciais de todos os módulos (categorias, exemplos, modelos da Wiki, regras de alerta). Idempotente.',
  timeoutSeconds: 300,
  shouldRunOnVersionUpgrade: false,
  shouldRunSynchronously: false,
  handler: async () => ({ resultados: await executarSeeds(SEEDS_DOS_MODULOS) }),
});
