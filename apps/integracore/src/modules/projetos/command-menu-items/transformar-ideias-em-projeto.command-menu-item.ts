import { defineCommandMenuItem, isSelectAll } from 'integra-sdk/define';

import {
  IDEIA_OBJECT_ID,
  TRANSFORMAR_IDEIAS_COMMAND_MENU_ITEM_ID,
  TRANSFORMAR_IDEIAS_FRONT_COMPONENT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

export default defineCommandMenuItem({
  universalIdentifier: TRANSFORMAR_IDEIAS_COMMAND_MENU_ITEM_ID,
  label: 'Transformar em projeto',
  shortLabel: 'Virar projeto',
  isPinned: true,
  availabilityType: 'RECORD_SELECTION',
  availabilityObjectUniversalIdentifier: IDEIA_OBJECT_ID,
  frontComponentUniversalIdentifier: TRANSFORMAR_IDEIAS_FRONT_COMPONENT_ID,
  conditionalAvailabilityExpression: !isSelectAll,
});
