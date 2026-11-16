import { defineView, ViewSortDirection, ViewType } from 'integra-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

const F = VENDAS_IDS.venda;

export const TODAS_AS_VENDAS_VIEW_ID = 'd687866c-b21c-4298-a51c-76bb6397f917';

export default defineView({
  universalIdentifier: TODAS_AS_VENDAS_VIEW_ID,
  name: 'Todas as vendas',
  objectUniversalIdentifier: VENDAS_IDS.objetoVenda,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: [
    { universalIdentifier: '6198f261-b486-4ce8-bd6f-657bcb42946d', fieldMetadataUniversalIdentifier: F.descricao, position: 0, isVisible: true, size: 220 },
    { universalIdentifier: '6b3e8bb4-1438-4164-8580-4ebf142bb532', fieldMetadataUniversalIdentifier: F.dataEvento, position: 1, isVisible: true, size: 160 },
    { universalIdentifier: '4d9dabde-de84-4080-aec6-74acfede2d19', fieldMetadataUniversalIdentifier: F.status, position: 2, isVisible: true, size: 130 },
    { universalIdentifier: 'f2836fca-5e4d-46c6-a51a-27a08b777ed6', fieldMetadataUniversalIdentifier: F.valor, position: 3, isVisible: true, size: 130 },
    { universalIdentifier: '5eb4fa94-9658-4243-83a1-bdd8939919ba', fieldMetadataUniversalIdentifier: F.valorLiquido, position: 4, isVisible: true, size: 130 },
    { universalIdentifier: 'a853bed3-ba24-46d2-8adf-ea17c09befd5', fieldMetadataUniversalIdentifier: F.taxaGateway, position: 5, isVisible: true, size: 120 },
    { universalIdentifier: '670d2d83-dcab-41db-8909-18f3efa735fc', fieldMetadataUniversalIdentifier: F.metodoPagamento, position: 6, isVisible: true, size: 150 },
    { universalIdentifier: '71067aa7-a928-4c80-b21e-2f4eef9edfc6', fieldMetadataUniversalIdentifier: F.parcelas, position: 7, isVisible: true, size: 90 },
    { universalIdentifier: 'e4c7be26-52fa-4da2-be0b-feb517d504a4', fieldMetadataUniversalIdentifier: F.gateway, position: 8, isVisible: true, size: 130 },
    { universalIdentifier: '7e6b7603-0b33-4123-90aa-a258c124568f', fieldMetadataUniversalIdentifier: F.clienteNome, position: 9, isVisible: true, size: 180 },
    { universalIdentifier: '87fb2a34-da22-4d8b-9c58-bb36409c131a', fieldMetadataUniversalIdentifier: F.clienteEmail, position: 10, isVisible: true, size: 200 },
    { universalIdentifier: 'd0a51973-39aa-407d-b971-4687a6fbbac9', fieldMetadataUniversalIdentifier: F.motivoRecusa, position: 11, isVisible: true, size: 200 },
    { universalIdentifier: '95d63a13-95bc-42bb-8360-d83e6456f20a', fieldMetadataUniversalIdentifier: F.idExterno, position: 12, isVisible: true, size: 180 },
    { universalIdentifier: '729a97f1-8b65-45d5-acaf-3280054dc947', fieldMetadataUniversalIdentifier: F.utmSource, position: 13, isVisible: false, size: 130 },
    { universalIdentifier: 'e1bd8d26-6566-4f50-9361-7c8e7d09ae6c', fieldMetadataUniversalIdentifier: F.utmMedium, position: 14, isVisible: false, size: 130 },
    { universalIdentifier: 'd7af2a62-e344-4d2c-9273-53b2d6dcd919', fieldMetadataUniversalIdentifier: F.utmCampaign, position: 15, isVisible: false, size: 150 },
  ],
  sorts: [
    { universalIdentifier: 'c5220dc4-7907-482d-8456-44c8721b04f5', fieldMetadataUniversalIdentifier: F.dataEvento, direction: ViewSortDirection.DESC },
  ],
});
