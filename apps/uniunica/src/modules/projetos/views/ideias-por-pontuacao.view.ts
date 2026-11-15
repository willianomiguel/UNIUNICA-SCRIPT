import { defineView, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  IDEIA_FIELD_IDS,
  IDEIA_OBJECT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

export default defineView({
  universalIdentifier: '3dc7014b-9c2b-4b88-a6fc-ed947aadb94e',
  name: 'Por pontuação',
  objectUniversalIdentifier: IDEIA_OBJECT_ID,
  type: ViewType.TABLE,
  icon: 'IconStar',
  position: 0,
  fields: [
    { universalIdentifier: 'cb35c6fa-db9a-4cce-84ff-e19278671b5c', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.titulo, position: 0, isVisible: true, size: 260 },
    { universalIdentifier: 'd2fde85e-c4e6-478f-b5f3-3352d0fbe55f', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.pontuacao, position: 1, isVisible: true, size: 110 },
    { universalIdentifier: 'c2e7382b-1568-4d4e-bef8-9c1b528e7f47', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.votos, position: 2, isVisible: true, size: 90 },
    { universalIdentifier: 'efe708fa-62f9-4949-b17c-7a68e019bc72', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.impacto, position: 3, isVisible: true, size: 120 },
    { universalIdentifier: 'b11bc36a-abc7-4f35-ab89-5ad68c90f854', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.esforco, position: 4, isVisible: true, size: 120 },
    { universalIdentifier: 'f420829c-700d-4249-a87d-50b446ab2cf8', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.status, position: 5, isVisible: true, size: 140 },
    { universalIdentifier: '6b042505-e07c-4259-b8c9-07df063d01cd', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.area, position: 6, isVisible: true, size: 150 },
    { universalIdentifier: '7c35d103-9a20-4d91-ace0-92d3a888fc35', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.autor, position: 7, isVisible: true, size: 160 },
    { universalIdentifier: 'ed4394d2-2297-43c4-99e8-3a549b327c41', fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.projeto, position: 8, isVisible: true, size: 180 },
  ],
  sorts: [
    {
      universalIdentifier: '347f0826-43df-4349-80fb-a570e434d632',
      fieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.pontuacao,
      direction: ViewSortDirection.DESC,
    },
  ],
});
