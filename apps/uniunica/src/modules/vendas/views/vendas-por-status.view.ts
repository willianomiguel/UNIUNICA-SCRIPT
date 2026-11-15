import { AggregateOperations, defineView, ViewType } from 'twenty-sdk/define';

import { VENDA_STATUS_OPCOES } from 'src/modules/vendas/constants/venda-status-opcoes';
import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

const F = VENDAS_IDS.venda;

const GROUP_IDS = [
  '060110da-b2a4-40dc-a4a4-39ae4fbb72f9',
  'c25fa087-49eb-40ce-b689-2446c9ffadc5',
  '558bbd66-1812-4793-8bbf-559a35347787',
  'f4565d87-f195-4285-890b-e28eef7c9f0d',
  'ec9868bd-2501-4df4-89e7-a0aa73126026',
  '6de305a7-d198-4eb5-9121-e54b2cc1b522',
  'ba5a1759-e824-4a94-8cc8-a3f89fa7e6f4',
];

export default defineView({
  universalIdentifier: '976fae30-daff-4ad7-bdf6-116ed158e618',
  name: 'Por status',
  objectUniversalIdentifier: VENDAS_IDS.objetoVenda,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 1,
  mainGroupByFieldMetadataUniversalIdentifier: F.status,
  kanbanAggregateOperation: AggregateOperations.SUM,
  kanbanAggregateOperationFieldMetadataUniversalIdentifier: F.valor,
  fields: [
    { universalIdentifier: 'cb6f9dd7-5f25-49e3-af90-3497d3ad9425', fieldMetadataUniversalIdentifier: F.descricao, position: 0, isVisible: true, size: 200 },
    { universalIdentifier: '5a98dc2f-a8a7-4d58-9b45-cfce5ce98cc1', fieldMetadataUniversalIdentifier: F.valor, position: 1, isVisible: true, size: 130 },
    { universalIdentifier: 'f2c93702-0985-4654-94be-eb321faa4e35', fieldMetadataUniversalIdentifier: F.clienteNome, position: 2, isVisible: true, size: 180 },
    { universalIdentifier: '7fc5e2fb-194e-4d18-894a-2a3c5374290d', fieldMetadataUniversalIdentifier: F.dataEvento, position: 3, isVisible: true, size: 160 },
    { universalIdentifier: '812d92fa-4c17-4852-8e89-ac56cd94ecbd', fieldMetadataUniversalIdentifier: F.gateway, position: 4, isVisible: true, size: 130 },
    { universalIdentifier: '089ccfb8-223f-4431-a0ea-a031f8cbf162', fieldMetadataUniversalIdentifier: F.metodoPagamento, position: 5, isVisible: true, size: 150 },
    { universalIdentifier: 'c78a4a64-7626-4779-b892-ce078b6ca51c', fieldMetadataUniversalIdentifier: F.status, position: 6, isVisible: true, size: 130 },
  ],
  groups: VENDA_STATUS_OPCOES.map((opcao, index) => ({
    universalIdentifier: GROUP_IDS[index],
    fieldValue: opcao.value,
    position: index,
    isVisible: true,
  })),
});
