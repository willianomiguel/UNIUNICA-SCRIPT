import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import {
  PROJETO_FIELD_IDS,
  PROJETO_OBJECT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

const FILTER_GROUP_ID = '59f1f767-b21d-405f-8902-9efcd23da09c';

// Projetos que começam ou terminam no trimestre corrente (filtro relativo: acompanha a data de hoje).
export default defineView({
  universalIdentifier: 'faec4afd-88d0-4253-b73c-4a5190ad4810',
  name: 'Este trimestre',
  objectUniversalIdentifier: PROJETO_OBJECT_ID,
  type: ViewType.TABLE,
  icon: 'IconCalendarStats',
  position: 3,
  fields: [
    { universalIdentifier: '10170cc1-f85b-4fa2-b24b-759278c49f0d', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.nome, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: '8fc1b937-63c5-46f7-a530-d500c2f80cf6', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.status, position: 1, isVisible: true, size: 150 },
    { universalIdentifier: '61ad0148-b79b-468d-8ffa-7e641d48d434', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.prioridade, position: 2, isVisible: true, size: 120 },
    { universalIdentifier: 'd01153f4-5806-4648-8534-899ea38a2865', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.area, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '7d4d9967-2e4f-408c-9cd9-30443ac86f01', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.responsavel, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: 'be39158c-8fb6-4937-a245-15c2bb18916c', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataInicio, position: 5, isVisible: true, size: 130 },
    { universalIdentifier: '2f7a8cd5-1c50-421c-acf1-c314d9e94054', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataFim, position: 6, isVisible: true, size: 130 },
    { universalIdentifier: '6e8b128a-51bf-447c-8c24-72fde6681bad', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.progresso, position: 7, isVisible: true, size: 120 },
    { universalIdentifier: '9b049fb0-16f9-47c8-8f5b-1d5b9a7fa312', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.trimestre, position: 8, isVisible: true, size: 110 },
  ],
  filterGroups: [
    {
      universalIdentifier: FILTER_GROUP_ID,
      logicalOperator: ViewFilterGroupLogicalOperator.OR,
    },
  ],
  filters: [
    {
      universalIdentifier: '99664c43-ce07-43b1-9889-7efa87b4fc27',
      fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataInicio,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: 'THIS_1_QUARTER',
      viewFilterGroupUniversalIdentifier: FILTER_GROUP_ID,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '556d000f-8ea2-4e4e-a29e-25c4be9b795e',
      fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataFim,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: 'THIS_1_QUARTER',
      viewFilterGroupUniversalIdentifier: FILTER_GROUP_ID,
      positionInViewFilterGroup: 1,
    },
  ],
  sorts: [
    {
      universalIdentifier: '7804859a-e38b-41cf-950e-90885cf82416',
      fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataFim,
      direction: ViewSortDirection.ASC,
    },
  ],
});
