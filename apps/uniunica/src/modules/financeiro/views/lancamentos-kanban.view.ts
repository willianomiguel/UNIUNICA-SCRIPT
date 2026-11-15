import {
  AggregateOperations,
  defineView,
  ViewType,
} from 'twenty-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const KANBAN_GROUP_IDS = [
  'e7213706-dc70-4fea-be92-998754af2929',
  '54840f13-770e-4e46-aecc-de71f8c084d5',
  '106d5662-0efc-4c68-87cb-a63926155daa',
  'fc9564b1-ff38-4418-bdb7-9894aa49f0c5',
];

export default defineView({
  universalIdentifier: FINANCEIRO_IDS.VIEW_KANBAN,
  name: 'Por status',
  objectUniversalIdentifier: OBJECTS.lancamento.universalIdentifier,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 4,
  fields: [
    {
      universalIdentifier: '6a9d78cc-3642-416c-a2f0-36d16ade0a2c',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DESCRICAO,
      position: 0,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '86acfc8b-2829-4d29-9e45-ebab8dfdd385',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VALOR,
      position: 1,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: '66c1d05e-f7e4-4435-9ad9-84fe3dd64761',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_TIPO,
      position: 2,
      isVisible: true,
      size: 110,
    },
    {
      universalIdentifier: 'c7f8046b-939a-4f05-90d5-f7bed1903d88',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VENCIMENTO,
      position: 3,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '9127cddc-4cec-4f73-82e1-670e368eb94f',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CATEGORIA,
      position: 4,
      isVisible: true,
      size: 170,
    },
  ],
  mainGroupByFieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_STATUS,
  kanbanAggregateOperation: AggregateOperations.SUM,
  kanbanAggregateOperationFieldMetadataUniversalIdentifier:
    FINANCEIRO_IDS.LANCAMENTO_VALOR,
  groups: ['PENDENTE', 'ATRASADO', 'PAGO', 'CANCELADO'].map(
    (fieldValue, position) => ({
      universalIdentifier: KANBAN_GROUP_IDS[position],
      fieldValue,
      position,
      isVisible: true,
    }),
  ),
});
