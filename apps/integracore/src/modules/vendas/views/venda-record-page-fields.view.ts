import { defineView, getFieldUniversalIdentifier, ViewType } from 'integra-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

const F = VENDAS_IDS.venda;

const standardField = (name: string) =>
  getFieldUniversalIdentifier({
    applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: VENDAS_IDS.objetoVenda,
    name,
  });

export const VENDA_RECORD_PAGE_FIELDS_VIEW_ID = '4be5f2ef-a95f-460e-a056-e2e4e544d43e';

const CAMPOS = [
  F.status,
  F.valor,
  F.valorLiquido,
  F.taxaGateway,
  F.dataEvento,
  F.metodoPagamento,
  F.parcelas,
  F.gateway,
  F.idExterno,
  F.clienteNome,
  F.clienteEmail,
  F.motivoRecusa,
  F.utmSource,
  F.utmMedium,
  F.utmCampaign,
  standardField('createdAt'),
];

const VIEW_FIELD_IDS = [
  'a0d1c1a0-e998-4ad2-805e-88c9641b3d8c', '519c63d1-7d0f-43c3-ae39-71da9e7883ae', 'b9913454-9d5e-44d7-aa93-5ec9feff4705', 'ba5e2acf-cfdb-4787-8efd-c40b48885f40', '7efc1c23-bf9d-4c44-a7f0-745f284a9650', 'feee2df4-2448-4990-aa98-7f56f3603bbe',
  '8e175597-7ff4-4c05-9311-0ed3e103248f', 'fdcc2faa-452f-4da4-843c-c80694ce2c08', 'b728a25e-0d9d-4034-b782-7d31b7315ec6', 'a1400400-fed9-4285-957b-94750f6d862d', 'e1bb721b-e73b-4730-b2bb-6357f758a920', '0d283cb8-f459-4b9e-91f3-ad4386b8af5c',
  '217b0aeb-cf6e-4029-a83f-3db3e659c516', 'ddb0d713-b243-44de-8b0a-122a8b42edd6', 'cc7aa7ad-a6c7-4833-82d4-7698e205e651', '5d67053d-8c0f-468a-88a0-2ba42e1e9c6f',
];

export default defineView({
  universalIdentifier: VENDA_RECORD_PAGE_FIELDS_VIEW_ID,
  name: 'Campos da venda',
  objectUniversalIdentifier: VENDAS_IDS.objetoVenda,
  type: ViewType.FIELDS_WIDGET,
  icon: 'IconListDetails',
  position: 0,
  fields: CAMPOS.map((fieldMetadataUniversalIdentifier, position) => ({
    universalIdentifier: VIEW_FIELD_IDS[position],
    fieldMetadataUniversalIdentifier,
    position,
    isVisible: true,
    size: 200,
  })),
});
