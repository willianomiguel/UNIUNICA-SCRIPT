import { defineView, ViewSortDirection, ViewType } from 'integra-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

const F = VENDAS_IDS.eventoPagamento;

export default defineView({
  universalIdentifier: '8f4f9e28-256a-44bb-adaf-901ff153f2f8',
  name: 'Todos os eventos',
  objectUniversalIdentifier: VENDAS_IDS.objetoEventoPagamento,
  type: ViewType.TABLE,
  icon: 'IconWebhook',
  position: 0,
  fields: [
    { universalIdentifier: '476856a7-1205-4217-8a48-b97b7d0eaf73', fieldMetadataUniversalIdentifier: F.tipo, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'e64363ee-03cc-432c-97d6-3a7bb5b78b35', fieldMetadataUniversalIdentifier: F.recebidoEm, position: 1, isVisible: true, size: 160 },
    { universalIdentifier: '7a40f9fb-2210-4e9f-a0e2-0674b015ead8', fieldMetadataUniversalIdentifier: F.gateway, position: 2, isVisible: true, size: 130 },
    { universalIdentifier: 'e0c99834-25b5-406b-94b0-32e6d5c89ba0', fieldMetadataUniversalIdentifier: F.processado, position: 3, isVisible: true, size: 110 },
    { universalIdentifier: '66f153ce-71e9-4968-af54-e8fc8f5d9e84', fieldMetadataUniversalIdentifier: F.erro, position: 4, isVisible: true, size: 240 },
    { universalIdentifier: '4b5f12ea-3941-4b11-9c28-e873dfe9a689', fieldMetadataUniversalIdentifier: F.idExterno, position: 5, isVisible: true, size: 180 },
    { universalIdentifier: '9b57454a-17f2-484a-a32f-359fc85384e7', fieldMetadataUniversalIdentifier: F.venda, position: 6, isVisible: true, size: 200 },
    { universalIdentifier: 'ec68ba00-6a1d-4ec8-94ca-2e93cf8a36bb', fieldMetadataUniversalIdentifier: F.payload, position: 7, isVisible: true, size: 260 },
  ],
  sorts: [
    { universalIdentifier: 'a3d76d79-87c8-4add-8d33-5175ccffb91e', fieldMetadataUniversalIdentifier: F.recebidoEm, direction: ViewSortDirection.DESC },
  ],
});
