import {
  AggregateOperations,
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineView({
  universalIdentifier: METAS_IDS.VIEW_POR_PERIODO,
  name: 'Por período',
  objectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconCalendarStats',
  position: 1,
  fields: [
    {
      universalIdentifier: '794fe738-7288-4035-a790-35b94f14be9b',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_PERIODO,
      position: 1,
      isVisible: true,
      size: 110,
    },
    {
      universalIdentifier: 'db88ce9e-70a5-4ecd-8a24-cfc809b96df7',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_TITULO,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: '5d40adae-1b84-4204-b992-e1ba69c3212a',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_STATUS,
      position: 2,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'dd8e976d-be4d-4da1-919f-2adbb05a80a8',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_PROGRESSO,
      position: 3,
      isVisible: true,
      size: 120,
      aggregateOperation: AggregateOperations.AVG,
    },
    {
      universalIdentifier: '44ba4e5e-96f9-4c7e-8370-ab7054f534bb',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_VALOR_ATUAL,
      position: 4,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '723b6c2f-15c5-41a3-94dc-569f56408119',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_VALOR_ALVO,
      position: 5,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '95824fc9-8c65-482d-a23d-ae9cba4e712e',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_DATA_INICIO,
      position: 6,
      isVisible: true,
      size: 110,
    },
    {
      universalIdentifier: '393625c9-7db4-49c3-addb-7439d90de026',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_DATA_FIM,
      position: 7,
      isVisible: true,
      size: 110,
    },
    {
      universalIdentifier: 'e9f4d7bb-84b0-4668-8dfb-eab4bf3ee0db',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_RESPONSAVEL,
      position: 8,
      isVisible: true,
      size: 160,
    },
  ],
  sorts: [
    {
      universalIdentifier: '26761706-34ee-4687-ae88-9868cd623ee0',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_PERIODO,
      direction: ViewSortDirection.DESC,
    },
    {
      universalIdentifier: '83356649-a5f3-494c-9927-071287911a03',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_DATA_INICIO,
      direction: ViewSortDirection.ASC,
    },
  ],
});
