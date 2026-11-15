import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import {
  CAMPANHA_DATA_FIM_FIELD_ID,
  CAMPANHA_DATA_INICIO_FIELD_ID,
  CAMPANHA_NOME_FIELD_ID,
  CAMPANHA_OBJECT_ID,
  CAMPANHA_OBJETIVO_FIELD_ID,
  CAMPANHA_ORCAMENTO_FIELD_ID,
  CAMPANHA_PLATAFORMA_FIELD_ID,
  CAMPANHA_STATUS_FIELD_ID,
  CAMPANHA_UTM_CAMPAIGN_FIELD_ID,
  CAMPANHAS_ATIVAS_VIEW_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

export default defineView({
  universalIdentifier: CAMPANHAS_ATIVAS_VIEW_ID,
  name: 'Campanhas ativas',
  objectUniversalIdentifier: CAMPANHA_OBJECT_ID,
  type: ViewType.TABLE,
  icon: 'IconPlayerPlay',
  position: 1,
  fields: [
    { universalIdentifier: 'e9a53861-fbcd-46be-b287-2bae0b8a33b8', fieldMetadataUniversalIdentifier: CAMPANHA_NOME_FIELD_ID, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '78cea6e8-7b3a-40d5-bd75-e5cc6f04c9ea', fieldMetadataUniversalIdentifier: CAMPANHA_PLATAFORMA_FIELD_ID, position: 1, isVisible: true, size: 140 },
    { universalIdentifier: '037ab668-9673-44e1-8fa3-d5176de6562f', fieldMetadataUniversalIdentifier: CAMPANHA_OBJETIVO_FIELD_ID, position: 2, isVisible: true, size: 160 },
    { universalIdentifier: 'a012d693-afb7-4350-be55-365d0abcab24', fieldMetadataUniversalIdentifier: CAMPANHA_ORCAMENTO_FIELD_ID, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '9e9d17d6-dd5b-4189-81d5-4ea55830db26', fieldMetadataUniversalIdentifier: CAMPANHA_DATA_INICIO_FIELD_ID, position: 4, isVisible: true, size: 130 },
    { universalIdentifier: '6e79ef60-7167-4ac4-b6f7-5ed2d8ca2c7d', fieldMetadataUniversalIdentifier: CAMPANHA_DATA_FIM_FIELD_ID, position: 5, isVisible: true, size: 130 },
    { universalIdentifier: '3ac709d1-ba99-4d01-b479-467959e5cc6e', fieldMetadataUniversalIdentifier: CAMPANHA_UTM_CAMPAIGN_FIELD_ID, position: 6, isVisible: true, size: 180 },
    { universalIdentifier: '109a87d3-1398-4368-8d61-7d9973c307bd', fieldMetadataUniversalIdentifier: CAMPANHA_STATUS_FIELD_ID, position: 7, isVisible: false, size: 120 },
  ],
  filters: [
    {
      universalIdentifier: '2f3c9e70-2767-42a2-ad73-1c289b985582',
      fieldMetadataUniversalIdentifier: CAMPANHA_STATUS_FIELD_ID,
      operand: ViewFilterOperand.IS,
      value: ['ATIVA'],
    },
  ],
  sorts: [
    { universalIdentifier: '01a04f8c-a20e-459a-bdfb-a15c586d1bea', fieldMetadataUniversalIdentifier: CAMPANHA_DATA_INICIO_FIELD_ID, direction: ViewSortDirection.DESC },
  ],
});
