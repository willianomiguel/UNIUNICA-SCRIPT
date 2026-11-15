import { defineView, ViewType } from 'twenty-sdk/define';

import {
  IDEIA_FIELD_IDS,
  IDEIA_OBJECT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

export const IDEIA_RECORD_PAGE_FIELDS_VIEW_ID = '5b240fc1-f383-4266-b43f-a637bebcc063';

export default defineView({
  universalIdentifier: IDEIA_RECORD_PAGE_FIELDS_VIEW_ID,
  name: 'Campos da ideia',
  objectUniversalIdentifier: IDEIA_OBJECT_ID,
  type: ViewType.FIELDS_WIDGET,
  icon: 'IconListDetails',
  position: 0,
  fields: [
    { universalIdentifier: 'a0b09799-1c5e-463b-a443-a2c4b1e1b279', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.status, position: 0, isVisible: true, size: 200 },
    { universalIdentifier: '2d0734cd-2cd3-4b21-afcc-f428f1dac668', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.area, position: 1, isVisible: true, size: 200 },
    { universalIdentifier: '89d4171a-e7e9-4635-ac06-2c53dec20cc6', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.autor, position: 2, isVisible: true, size: 200 },
    { universalIdentifier: '24c36e93-3778-4394-9933-afff3a0cef07', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.impacto, position: 3, isVisible: true, size: 200 },
    { universalIdentifier: 'f863b347-9e44-4d76-90c8-ffc56d351dc3', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.esforco, position: 4, isVisible: true, size: 200 },
    { universalIdentifier: '428df59f-6b25-4725-b457-5a049862afe7', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.votos, position: 5, isVisible: true, size: 200 },
    { universalIdentifier: '3ae77ef5-8d54-4a36-83de-5d0dbe2d19df', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.pontuacao, position: 6, isVisible: true, size: 200 },
    { universalIdentifier: '4d4a7cb4-be1f-4a8f-9ebe-d4e5ac99cbf6', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.projeto, position: 7, isVisible: true, size: 200 },
  ],
});
