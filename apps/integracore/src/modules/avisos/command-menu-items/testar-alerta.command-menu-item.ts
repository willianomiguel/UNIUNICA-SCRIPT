import { defineCommandMenuItem, isSelectAll } from 'integra-sdk/define';

import { AVISOS_UNIVERSAL_IDENTIFIERS } from 'src/modules/avisos/constants/avisos-universal-identifiers';

export default defineCommandMenuItem({
  universalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.testarAlertaCommandMenuItem,
  label: 'Testar alerta',
  shortLabel: 'Testar',
  isPinned: true,
  availabilityType: 'RECORD_SELECTION',
  availabilityObjectUniversalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.object,
  frontComponentUniversalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.testarAlertaFrontComponent,
  conditionalAvailabilityExpression: !isSelectAll,
});
