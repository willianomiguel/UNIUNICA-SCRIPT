import { defineView, getFieldUniversalIdentifier, ViewType } from 'integra-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const systemField = (name: string) =>
  getFieldUniversalIdentifier({
    applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: OBJECTS.lancamento.universalIdentifier,
    name,
  });

export default defineView({
  universalIdentifier: FINANCEIRO_IDS.VIEW_LANCAMENTO_FIELDS,
  name: 'lancamento-record-page-fields',
  objectUniversalIdentifier: OBJECTS.lancamento.universalIdentifier,
  type: ViewType.FIELDS_WIDGET,
  icon: 'IconListDetails',
  position: 0,
  fields: [
    {
      universalIdentifier: '8cd0add2-f979-41c2-9e35-f5590ded316e',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DESCRICAO,
      position: 0,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'd300fa00-64cd-44f0-975a-1752479b7a4a',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_TIPO,
      position: 1,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '3c2c4f2b-d1a7-4134-ae7e-98c134396efa',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VALOR,
      position: 2,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '9cb48881-da1d-46e6-ac35-11b028cb6a7c',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_STATUS,
      position: 3,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'e6ddba55-d154-4f01-90b8-5e53e408d2a8',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DATA,
      position: 4,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'cb73f23c-94ea-4e9a-b672-35014f97765f',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VENCIMENTO,
      position: 5,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '386a78a3-f9ea-4be1-bf99-9e78dbe1b044',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CATEGORIA,
      position: 6,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'cfc6ae9b-3e46-44a2-b577-6da4c24b20d3',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CENTRO_CUSTO,
      position: 7,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '67bdf687-c833-49ec-9f45-6282a91028b7',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_FORMA_PAGAMENTO,
      position: 8,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '364bd456-06bb-48ee-8fa5-556e261d2c73',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_RECORRENCIA,
      position: 9,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'cee6aa4a-51f0-4335-8274-74ca48795847',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_ORIGEM,
      position: 10,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'c8201e51-991c-475a-884c-2a1868edefbc',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VENDA,
      position: 11,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '559c729c-2477-4a81-a9ba-a49b6351bb06',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_OBSERVACOES,
      position: 12,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'f07d0074-8c71-4f1d-a0c1-8b7e2b664bda',
      fieldMetadataUniversalIdentifier: systemField('createdAt'),
      position: 13,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '62414273-bc68-4ea1-9f3f-10806dbb5fa2',
      fieldMetadataUniversalIdentifier: systemField('createdBy'),
      position: 14,
      isVisible: true,
      size: 200,
    },
  ],
});
