import { defineView, ViewSortDirection, ViewType } from 'integra-sdk/define';

import {
  CAMPANHA_DATA_FIM_FIELD_ID,
  CAMPANHA_DATA_INICIO_FIELD_ID,
  CAMPANHA_NOME_FIELD_ID,
  CAMPANHA_OBJECT_ID,
  CAMPANHA_ORCAMENTO_FIELD_ID,
  CAMPANHA_PLATAFORMA_FIELD_ID,
  CAMPANHA_STATUS_FIELD_ID,
  CAMPANHA_UTM_CAMPAIGN_FIELD_ID,
  CAMPANHAS_TODAS_VIEW_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

export default defineView({
  universalIdentifier: CAMPANHAS_TODAS_VIEW_ID,
  name: 'Todas as campanhas',
  objectUniversalIdentifier: CAMPANHA_OBJECT_ID,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: [
    { universalIdentifier: 'a2ce9723-93b9-4dcd-a4c0-28b38ba77d24', fieldMetadataUniversalIdentifier: CAMPANHA_NOME_FIELD_ID, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'f5f413df-b0ce-4027-9834-df417986dd43', fieldMetadataUniversalIdentifier: CAMPANHA_PLATAFORMA_FIELD_ID, position: 1, isVisible: true, size: 140 },
    { universalIdentifier: '8afa9617-bf2e-4435-bc88-03b6741206d0', fieldMetadataUniversalIdentifier: CAMPANHA_STATUS_FIELD_ID, position: 2, isVisible: true, size: 120 },
    { universalIdentifier: '6af6ef4a-6efd-4c34-aacc-72927871024a', fieldMetadataUniversalIdentifier: CAMPANHA_ORCAMENTO_FIELD_ID, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '32c605a0-766f-424e-a5ce-45a2a18c5885', fieldMetadataUniversalIdentifier: CAMPANHA_DATA_INICIO_FIELD_ID, position: 4, isVisible: true, size: 130 },
    { universalIdentifier: '4be2184d-b966-4751-a5cb-b636b0cf336d', fieldMetadataUniversalIdentifier: CAMPANHA_DATA_FIM_FIELD_ID, position: 5, isVisible: true, size: 130 },
    { universalIdentifier: '51e226dc-ef9a-4e46-a5d5-c933cfd640db', fieldMetadataUniversalIdentifier: CAMPANHA_UTM_CAMPAIGN_FIELD_ID, position: 6, isVisible: true, size: 180 },
  ],
  sorts: [
    { universalIdentifier: 'b853ce72-679b-44a9-950d-39c9ef5a4cbd', fieldMetadataUniversalIdentifier: CAMPANHA_DATA_INICIO_FIELD_ID, direction: ViewSortDirection.DESC },
  ],
});
