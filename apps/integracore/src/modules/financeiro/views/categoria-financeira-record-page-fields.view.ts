import { defineView, getFieldUniversalIdentifier, ViewType } from 'integra-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const systemField = (name: string) =>
  getFieldUniversalIdentifier({
    applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: OBJECTS.categoriaFinanceira.universalIdentifier,
    name,
  });

export default defineView({
  universalIdentifier: FINANCEIRO_IDS.VIEW_CATEGORIA_FIELDS,
  name: 'categoriaFinanceira-record-page-fields',
  objectUniversalIdentifier: OBJECTS.categoriaFinanceira.universalIdentifier,
  type: ViewType.FIELDS_WIDGET,
  icon: 'IconListDetails',
  position: 0,
  fields: [
    {
      universalIdentifier: '5be2d4fa-bc27-4251-a1a3-f3c4e3e84df2',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_NOME,
      position: 0,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '52477946-5b4a-480f-b415-4cb821b9efab',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_TIPO,
      position: 1,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'e718f3a3-af18-453a-97e7-d7b55edef842',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_ORCAMENTO_MENSAL,
      position: 2,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '8d46a9e5-2da3-41cf-92f2-9751a940e46a',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_COR,
      position: 3,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'de4d1d50-ece9-46a2-bbed-8a332e100315',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_DESCRICAO,
      position: 4,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '12279053-5a6c-4a51-a21f-02196ca5d521',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_LANCAMENTOS,
      position: 5,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '5934d31c-b2c8-468f-a468-f83e9ee37663',
      fieldMetadataUniversalIdentifier: systemField('createdAt'),
      position: 6,
      isVisible: true,
      size: 200,
    },
  ],
});
