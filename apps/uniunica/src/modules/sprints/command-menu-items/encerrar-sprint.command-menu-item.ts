import {
  defineCommandMenuItem,
  everyEquals,
  selectedRecords,
} from 'twenty-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineCommandMenuItem({
  universalIdentifier: SPRINTS_IDS.commandMenuItems.encerrarSprint,
  label: 'Encerrar sprint',
  shortLabel: 'Encerrar',
  isPinned: true,
  availabilityType: 'RECORD_SELECTION',
  availabilityObjectUniversalIdentifier: SPRINTS_IDS.objects.sprint,
  frontComponentUniversalIdentifier: SPRINTS_IDS.frontComponents.encerrarSprint,
  conditionalAvailabilityExpression: everyEquals(selectedRecords, 'status', 'ATIVA'),
});
