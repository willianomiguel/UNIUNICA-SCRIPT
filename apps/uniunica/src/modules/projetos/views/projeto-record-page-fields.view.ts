import { defineView, ViewType } from 'twenty-sdk/define';

import {
  PROJETO_FIELD_IDS,
  PROJETO_OBJECT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

export const PROJETO_RECORD_PAGE_FIELDS_VIEW_ID = '2f3a6fdf-7bc3-429f-ba3b-f3229a9eb825';

export default defineView({
  universalIdentifier: PROJETO_RECORD_PAGE_FIELDS_VIEW_ID,
  name: 'Campos do projeto',
  objectUniversalIdentifier: PROJETO_OBJECT_ID,
  type: ViewType.FIELDS_WIDGET,
  icon: 'IconListDetails',
  position: 0,
  fields: [
    { universalIdentifier: '5b881595-4810-4cb4-81f5-3b219ebda7f0', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.status, position: 0, isVisible: true, size: 200 },
    { universalIdentifier: '9fac021d-2077-4dd8-90dd-d71893490cd9', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.prioridade, position: 1, isVisible: true, size: 200 },
    { universalIdentifier: '283c5b6a-094f-4ff8-b53d-6b358003c092', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.area, position: 2, isVisible: true, size: 200 },
    { universalIdentifier: '55304393-b451-49d6-afac-641d4c59d393', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.responsavel, position: 3, isVisible: true, size: 200 },
    { universalIdentifier: 'f97b709c-6082-4c98-b2c0-da23d3f4d6e3', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataInicio, position: 4, isVisible: true, size: 200 },
    { universalIdentifier: '8ebd7ef3-b6df-4cee-b227-7d69b14fb000', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataFim, position: 5, isVisible: true, size: 200 },
    { universalIdentifier: 'bd429a66-1dee-4cfd-9faa-349ca1569bd0', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.progresso, position: 6, isVisible: true, size: 200 },
    { universalIdentifier: 'e3c1b1f5-dd3e-416a-b7f3-bc92dd07be5c', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.trimestre, position: 7, isVisible: true, size: 200 },
    { universalIdentifier: 'cd514afb-27c6-4704-a0b6-96a6dd30ad31', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.ideias, position: 8, isVisible: true, size: 200 },
  ],
});
