import { AggregateOperations, defineView, ViewType } from 'twenty-sdk/define';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const KANBAN_GROUP_IDS = ['f6b6f55d-839e-449b-a6d6-8a5e410a3ae9', '77ccf38d-94a4-4983-8a57-c3b8ac50e56a', '43de2648-4384-416e-888e-cb8c82b8e45f', '3e22c503-b84f-4e4e-b3e6-a42fa3cd308b'];

export default defineView({
  universalIdentifier: METAS_IDS.VIEW_KANBAN,
  name: 'Por status',
  objectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 2,
  mainGroupByFieldMetadataUniversalIdentifier: METAS_IDS.META_STATUS,
  kanbanAggregateOperation: AggregateOperations.AVG,
  kanbanAggregateOperationFieldMetadataUniversalIdentifier: METAS_IDS.META_PROGRESSO,
  fields: [
    {
      universalIdentifier: '2adb2ac6-4c85-44f0-8e44-27d375450f7c',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_TITULO,
      position: 0,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '776e3afa-c4d6-45c6-b920-76367036a72c',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_PROGRESSO,
      position: 1,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '71ebb6d2-e1de-45aa-974c-2d90996f24ac',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_PERIODO,
      position: 2,
      isVisible: true,
      size: 110,
    },
    {
      universalIdentifier: 'b7201359-fc25-4ff0-a501-a897aa3f612d',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_RESPONSAVEL,
      position: 3,
      isVisible: true,
      size: 160,
    },
  ],
  groups: ['NO_PRAZO', 'EM_RISCO', 'ATRASADA', 'CONCLUIDA'].map(
    (fieldValue, position) => ({
      universalIdentifier: KANBAN_GROUP_IDS[position],
      fieldValue,
      position,
      isVisible: true,
    }),
  ),
});
