import {
  defineCommandMenuItem,
  everyEquals,
  selectedRecords,
} from 'integra-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineCommandMenuItem({
  universalIdentifier: SPRINTS_IDS.commandMenuItems.iniciarSprint,
  label: 'Iniciar sprint',
  shortLabel: 'Iniciar',
  isPinned: true,
  availabilityType: 'RECORD_SELECTION',
  availabilityObjectUniversalIdentifier: SPRINTS_IDS.objects.sprint,
  frontComponentUniversalIdentifier: SPRINTS_IDS.frontComponents.iniciarSprint,
  conditionalAvailabilityExpression: everyEquals(selectedRecords, 'status', 'PLANEJADA'),
});
