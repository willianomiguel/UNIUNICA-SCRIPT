import { defineView, ViewType } from 'integra-sdk/define';

import {
  CAMPANHA_DATA_INICIO_FIELD_ID,
  CAMPANHA_NOME_FIELD_ID,
  CAMPANHA_OBJECT_ID,
  CAMPANHA_ORCAMENTO_FIELD_ID,
  CAMPANHA_PLATAFORMA_FIELD_ID,
  CAMPANHA_STATUS_FIELD_ID,
  CAMPANHAS_POR_PLATAFORMA_VIEW_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';
import { PLATAFORMA_OPTIONS } from 'src/modules/trafego/objects/campanha.object';

const GROUP_IDS = [
  'ea6ce366-0eb7-41ee-a8ce-0a028187de21',
  '637cbe4e-d46c-46e7-b9c4-109301baf408',
  '98bf70b2-d757-4756-ba27-9e2f668abb84',
  'c76e43d4-6016-4220-a081-343164979335',
  '18372a10-a811-4baf-b4f4-bdc40bed3dec',
  '1cdab09a-b3da-42cf-b85d-6fb5749c47e6',
  'dac847e2-7a01-4586-a17d-472b666ccd45',
];

export default defineView({
  universalIdentifier: CAMPANHAS_POR_PLATAFORMA_VIEW_ID,
  name: 'Por plataforma',
  objectUniversalIdentifier: CAMPANHA_OBJECT_ID,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 2,
  mainGroupByFieldMetadataUniversalIdentifier: CAMPANHA_PLATAFORMA_FIELD_ID,
  fields: [
    { universalIdentifier: 'c2baa3c1-a896-49cd-8144-39c5210a83a3', fieldMetadataUniversalIdentifier: CAMPANHA_NOME_FIELD_ID, position: 0, isVisible: true, size: 200 },
    { universalIdentifier: 'd02115af-2405-408e-bc97-a4a41ed2b6ce', fieldMetadataUniversalIdentifier: CAMPANHA_PLATAFORMA_FIELD_ID, position: 1, isVisible: true, size: 140 },
    { universalIdentifier: '1351a18f-fa01-49f5-a5b7-97086538d92c', fieldMetadataUniversalIdentifier: CAMPANHA_STATUS_FIELD_ID, position: 2, isVisible: true, size: 120 },
    { universalIdentifier: '9e316a6a-291a-4176-b34b-779305329c99', fieldMetadataUniversalIdentifier: CAMPANHA_ORCAMENTO_FIELD_ID, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'baeac5d0-255e-4918-887b-466f709029df', fieldMetadataUniversalIdentifier: CAMPANHA_DATA_INICIO_FIELD_ID, position: 4, isVisible: true, size: 130 },
  ],
  groups: PLATAFORMA_OPTIONS.map((option, index) => ({
    universalIdentifier: GROUP_IDS[index],
    fieldValue: option.value,
    position: index,
    isVisible: true,
  })),
});
