import {
  AggregateOperations,
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineView({
  universalIdentifier: METAS_IDS.VIEW_TODAS,
  name: 'Todas',
  objectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: [
    {
      universalIdentifier: 'c0a02f3d-ae1c-4beb-ac1e-c5b1013d8715',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_TITULO,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: '7dc03b8d-a717-45da-8388-312e68deda97',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_STATUS,
      position: 1,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '7cd1bfb9-978b-4812-8a7d-193cd80ad080',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_PROGRESSO,
      position: 2,
      isVisible: true,
      size: 120,
      aggregateOperation: AggregateOperations.AVG,
    },
    {
      universalIdentifier: '96ca1618-6ff0-42c0-b667-979c7ddf419a',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_VALOR_ATUAL,
      position: 3,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'd66c4a22-dd15-4e75-b3df-b49f428977b4',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_VALOR_ALVO,
      position: 4,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'e0bab405-a972-4d9c-b072-6d4649e6ad61',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_UNIDADE,
      position: 5,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '2f7dc083-9d5f-4639-be56-1e366318f258',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_PERIODO,
      position: 6,
      isVisible: true,
      size: 110,
    },
    {
      universalIdentifier: '3b7624be-0383-4df4-ba42-020f9f4fc873',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_DATA_FIM,
      position: 7,
      isVisible: true,
      size: 110,
    },
    {
      universalIdentifier: '17870085-4e74-4dcc-a607-496c3953bfdb',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_FONTE,
      position: 8,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: 'b822c8fc-399f-4e95-9034-8e2d7e69f479',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_RESPONSAVEL,
      position: 9,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: 'cba58e32-9a7f-4e43-964d-f9d96c83b297',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_PAI,
      position: 10,
      isVisible: true,
      size: 180,
    },
  ],
  sorts: [
    {
      universalIdentifier: '2f0a0c05-40b7-4f58-8202-c64585a50077',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_DATA_FIM,
      direction: ViewSortDirection.ASC,
    },
  ],
});
