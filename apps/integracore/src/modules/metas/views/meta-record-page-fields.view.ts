import { defineView, getFieldUniversalIdentifier, ViewType } from 'integra-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const systemField = (name: string) =>
  getFieldUniversalIdentifier({
    applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
    name,
  });

export default defineView({
  universalIdentifier: METAS_IDS.VIEW_META_FIELDS,
  name: 'meta-record-page-fields',
  objectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
  type: ViewType.FIELDS_WIDGET,
  icon: 'IconListDetails',
  position: 0,
  fields: [
    {
      universalIdentifier: '83244e02-efe1-485e-9e84-be17f7a3e7f3',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_TITULO,
      position: 0,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '4a8ecd95-969b-468b-bdff-cbaf523cbf88',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_STATUS,
      position: 1,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '4f24d6e7-ef4f-4d5f-b50b-fd21c0dce3f7',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_PROGRESSO,
      position: 2,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'f5cd5088-5563-48d5-8435-5266ad5f9a01',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_VALOR_ATUAL,
      position: 3,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '4d935115-b9c1-473e-9322-67cd93940a7c',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_VALOR_ALVO,
      position: 4,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '11111433-c28d-41b1-ae11-d9a5d82b6d10',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_VALOR_INICIAL,
      position: 5,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'b501e170-f7fc-4fac-b066-bbc512798309',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_UNIDADE,
      position: 6,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'ca7c1d46-095e-4665-9d99-f11a602f9958',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_FONTE,
      position: 7,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '5fea1b94-7b67-486f-b51f-3215352ae7c2',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_PERIODO,
      position: 8,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'd65a1843-f54b-4619-a09a-8ad593d605e3',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_DATA_INICIO,
      position: 9,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '466e9461-3714-4acc-8d57-2de5502fece2',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_DATA_FIM,
      position: 10,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'd53c9691-e653-4dec-bf20-172c51ee9514',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_RESPONSAVEL,
      position: 11,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '2dd863f7-3831-412d-a9ad-0ab2c3f58a1a',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_PAI,
      position: 12,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '2b729f3c-5dce-4102-af8c-7995fc3d66ed',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_SUBMETAS,
      position: 13,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'bb834ebb-bd26-4677-96f9-7de58b953dd5',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_DESCRICAO,
      position: 14,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'cb0118a5-dd30-4930-aee1-20d5956f1d47',
      fieldMetadataUniversalIdentifier: METAS_IDS.META_ULTIMA_ATUALIZACAO,
      position: 15,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '3ed6ac27-a64f-4c3c-be78-2e1c605be62d',
      fieldMetadataUniversalIdentifier: systemField('createdAt'),
      position: 16,
      isVisible: true,
      size: 200,
    },
  ],
});
