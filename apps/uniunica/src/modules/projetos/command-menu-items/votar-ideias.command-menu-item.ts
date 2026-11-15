import { defineCommandMenuItem, isSelectAll } from 'twenty-sdk/define';

import {
  IDEIA_OBJECT_ID,
  VOTAR_IDEIAS_COMMAND_MENU_ITEM_ID,
  VOTAR_IDEIAS_FRONT_COMPONENT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

export default defineCommandMenuItem({
  universalIdentifier: VOTAR_IDEIAS_COMMAND_MENU_ITEM_ID,
  label: 'Votar',
  shortLabel: 'Votar',
  isPinned: true,
  availabilityType: 'RECORD_SELECTION',
  availabilityObjectUniversalIdentifier: IDEIA_OBJECT_ID,
  frontComponentUniversalIdentifier: VOTAR_IDEIAS_FRONT_COMPONENT_ID,
  conditionalAvailabilityExpression: !isSelectAll,
});
