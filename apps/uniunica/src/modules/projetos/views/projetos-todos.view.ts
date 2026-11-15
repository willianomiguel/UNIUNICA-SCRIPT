import { defineView, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  PROJETO_FIELD_IDS,
  PROJETO_OBJECT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

export default defineView({
  universalIdentifier: 'ab0a50be-de20-4d54-b147-597908b91f1d',
  name: 'Todos',
  objectUniversalIdentifier: PROJETO_OBJECT_ID,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: [
    { universalIdentifier: '109e3238-6969-483b-810a-ee16cf2a7121', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.nome, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'a48d17a0-3817-4bf8-bd11-8190b3a4249d', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.status, position: 1, isVisible: true, size: 150 },
    { universalIdentifier: '1dd97bb7-742f-4348-bd0f-22918dbc23fa', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.prioridade, position: 2, isVisible: true, size: 120 },
    { universalIdentifier: '90fdc1d6-d3af-466e-9a94-63bc563af76a', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.area, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '3708681f-b56c-4b8a-98b0-6c8929cb36a4', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.responsavel, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '162f3393-d44c-4284-a5cf-b1148950a297', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataInicio, position: 5, isVisible: true, size: 130 },
    { universalIdentifier: '96c1096d-0afa-46e1-a9a3-b61937193a87', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataFim, position: 6, isVisible: true, size: 130 },
    { universalIdentifier: 'b54c1730-ccfd-4b37-8472-9685612ae4f1', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.progresso, position: 7, isVisible: true, size: 120 },
    { universalIdentifier: '54e43a97-b1a1-4cdc-a116-7f24f3bf3aa4', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.trimestre, position: 8, isVisible: true, size: 110 },
  ],
  sorts: [
    {
      universalIdentifier: 'f09ff75e-9d88-4d35-9d4c-f3c82981bc03',
      fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataInicio,
      direction: ViewSortDirection.ASC,
    },
  ],
});
