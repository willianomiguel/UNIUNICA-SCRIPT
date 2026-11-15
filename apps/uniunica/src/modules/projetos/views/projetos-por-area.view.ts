import { defineView, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import { PROJETO_AREA_OPTIONS } from 'src/modules/projetos/constants/projeto-area-options';
import {
  PROJETO_FIELD_IDS,
  PROJETO_OBJECT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

const GROUP_IDS = [
  '715f88c4-600a-4697-90f8-f4e5c1296eb2',
  '641ba179-1125-417d-bb99-f1fe98742d43',
  'e82f11ae-4bf7-4555-87f1-e9845d94a968',
  'd7d55ab4-ef38-48a4-8186-406c50bfb67a',
  '929fb151-906d-4b38-a3a2-fc4f27b7c613',
];

export default defineView({
  universalIdentifier: 'e9630e10-a6e9-46c7-9470-d107455d2216',
  name: 'Por área',
  objectUniversalIdentifier: PROJETO_OBJECT_ID,
  type: ViewType.TABLE,
  icon: 'IconCategory',
  position: 2,
  mainGroupByFieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.area,
  fields: [
    { universalIdentifier: 'fef5fce9-f2d3-4c83-a2ea-ca99a53a077b', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.nome, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'fb155692-fa55-4742-93f7-410dadc5ff82', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.status, position: 1, isVisible: true, size: 150 },
    { universalIdentifier: 'c13515fc-0d77-4f91-98eb-d39d793c0461', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.prioridade, position: 2, isVisible: true, size: 120 },
    { universalIdentifier: '6beda66b-4cf2-44bc-96db-8682aea9d468', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.area, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '490a4136-6282-48cc-8ae0-6e7eda478e04', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.responsavel, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: '6e6fede6-8086-46ef-8856-7f8a2ccd2383', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataInicio, position: 5, isVisible: true, size: 130 },
    { universalIdentifier: 'f009a7a3-85e7-4e95-b313-8fb79b80d53a', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataFim, position: 6, isVisible: true, size: 130 },
    { universalIdentifier: '572c7e80-b080-45b3-918a-9f96ca3dbf45', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.progresso, position: 7, isVisible: true, size: 120 },
    { universalIdentifier: '54c55cee-7459-4956-8b62-d1a0ebcbe25d', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.trimestre, position: 8, isVisible: true, size: 110 },
  ],
  groups: PROJETO_AREA_OPTIONS.map((option, index) => ({
    universalIdentifier: GROUP_IDS[index],
    fieldValue: option.value,
    position: index,
    isVisible: true,
  })),
  sorts: [
    {
      universalIdentifier: '10868ae9-e1d4-4f10-b455-af3cde4224b9',
      fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataInicio,
      direction: ViewSortDirection.ASC,
    },
  ],
});
