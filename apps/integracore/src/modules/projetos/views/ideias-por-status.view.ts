import { defineView, ViewSortDirection, ViewType } from 'integra-sdk/define';

import { IDEIA_STATUS_OPTIONS } from 'src/modules/projetos/constants/ideia-status-options';
import {
  IDEIA_FIELD_IDS,
  IDEIA_OBJECT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

const GROUP_IDS = [
  '0bfc13f0-da46-45b9-84af-a0cdc40dfb3f',
  'a3ecc067-28fa-46ca-8542-d0449ccecefb',
  'a17c5150-5e8a-49d1-828b-ca54047f9e0f',
  '6496b68b-da08-45b5-b9eb-671462b32ec2',
  'e0dbb3c5-8d6b-422f-8d99-d8bd7f44da12',
];

export default defineView({
  universalIdentifier: 'bd82c432-31d6-4787-b7e4-2ae2ded515d9',
  name: 'Kanban por status',
  objectUniversalIdentifier: IDEIA_OBJECT_ID,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 1,
  mainGroupByFieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.status,
  fields: [
    { universalIdentifier: '4b8cbe35-91db-4178-a4fc-2cac2d6b5aa0', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.titulo, position: 0, isVisible: true, size: 260 },
    { universalIdentifier: 'e2b5483f-63b5-461b-97df-323b8ff64723', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.pontuacao, position: 1, isVisible: true, size: 110 },
    { universalIdentifier: 'adf297d4-22a3-4e37-afa4-cb92e087a807', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.votos, position: 2, isVisible: true, size: 90 },
    { universalIdentifier: 'b4054164-f0b3-4b4e-95d7-f8d96c178034', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.impacto, position: 3, isVisible: true, size: 120 },
    { universalIdentifier: '24f1703c-ecc4-41c4-89d7-b95e75912f6d', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.esforco, position: 4, isVisible: true, size: 120 },
    { universalIdentifier: '987890f7-fb0c-454f-b73e-108734d56ab1', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.status, position: 5, isVisible: true, size: 140 },
    { universalIdentifier: '9ea3e73b-1a6c-4fb9-8ecd-e231f67ea240', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.area, position: 6, isVisible: true, size: 150 },
    { universalIdentifier: 'ebc85eaa-534b-43c7-b027-2000f63764f1', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.autor, position: 7, isVisible: true, size: 160 },
    { universalIdentifier: '27eb2ab1-b989-459e-a221-0d738292f646', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.projeto, position: 8, isVisible: true, size: 180 },
  ],
  groups: IDEIA_STATUS_OPTIONS.map((option, index) => ({
    universalIdentifier: GROUP_IDS[index],
    fieldValue: option.value,
    position: index,
    isVisible: true,
  })),
  sorts: [
    {
      universalIdentifier: '5e28b7e6-2302-4bb2-a66f-1873ed665571',
      fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.pontuacao,
      direction: ViewSortDirection.DESC,
    },
  ],
});
