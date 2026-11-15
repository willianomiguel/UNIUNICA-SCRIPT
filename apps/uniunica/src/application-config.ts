import { defineApplication } from 'twenty-sdk/define';

import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';
import AVISOS_APPLICATION_VARIABLES from 'src/modules/avisos/constants/avisos-application-variables';
import SPRINTS_APPLICATION_VARIABLES from 'src/modules/sprints/constants/sprints-application-variables';
import TRAFEGO_APPLICATION_VARIABLES from 'src/modules/trafego/constants/trafego-application-variables';
import VENDAS_APPLICATION_VARIABLES from 'src/modules/vendas/constants/vendas-application-variables';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  // Segredos e configurações de cada módulo (preenchidos em Configurações > Apps > UniÚnica Gestão)
  applicationVariables: {
    ...VENDAS_APPLICATION_VARIABLES,
    ...TRAFEGO_APPLICATION_VARIABLES,
    ...SPRINTS_APPLICATION_VARIABLES,
    ...AVISOS_APPLICATION_VARIABLES,
  },
});
