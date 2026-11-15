import { defineView, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineView({
  universalIdentifier: FINANCEIRO_IDS.VIEW_CATEGORIAS,
  name: 'Todas as categorias',
  objectUniversalIdentifier: OBJECTS.categoriaFinanceira.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconCategory',
  position: 0,
  fields: [
    {
      universalIdentifier: 'f2582ffe-1f4b-40e8-b922-8df91e7b2d9d',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_NOME,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: '8e2b69d9-0f1c-4b99-a017-1efb3586b07d',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_TIPO,
      position: 1,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '1b9bb4f3-b3b9-4b00-b848-1a6d126603d7',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_ORCAMENTO_MENSAL,
      position: 2,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: 'd89dadce-b0ec-4ab7-a044-0f8b2a9f4df1',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_COR,
      position: 3,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '6804d33c-d8ab-414d-9ce2-133c4a4ddf58',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_LANCAMENTOS,
      position: 4,
      isVisible: true,
      size: 200,
    },
  ],
  sorts: [
    {
      universalIdentifier: '4c758574-78b1-43f2-a6d8-43033a72027b',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_NOME,
      direction: ViewSortDirection.ASC,
    },
  ],
});
