import { defineView, ViewType } from 'integra-sdk/define';

import {
  CAMPANHA_DATA_FIM_FIELD_ID,
  CAMPANHA_DATA_INICIO_FIELD_ID,
  CAMPANHA_ID_EXTERNO_FIELD_ID,
  CAMPANHA_LINK_FIELD_ID,
  CAMPANHA_NOME_FIELD_ID,
  CAMPANHA_OBJECT_ID,
  CAMPANHA_OBJETIVO_FIELD_ID,
  CAMPANHA_ORCAMENTO_FIELD_ID,
  CAMPANHA_PLATAFORMA_FIELD_ID,
  CAMPANHA_RECORD_FIELDS_VIEW_ID,
  CAMPANHA_STATUS_FIELD_ID,
  CAMPANHA_UTM_CAMPAIGN_FIELD_ID,
  METRICAS_ON_CAMPANHA_FIELD_ID,
  VENDAS_ON_CAMPANHA_FIELD_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

const CAMPOS = [
  CAMPANHA_NOME_FIELD_ID,
  CAMPANHA_PLATAFORMA_FIELD_ID,
  CAMPANHA_STATUS_FIELD_ID,
  CAMPANHA_OBJETIVO_FIELD_ID,
  CAMPANHA_ORCAMENTO_FIELD_ID,
  CAMPANHA_DATA_INICIO_FIELD_ID,
  CAMPANHA_DATA_FIM_FIELD_ID,
  CAMPANHA_UTM_CAMPAIGN_FIELD_ID,
  CAMPANHA_ID_EXTERNO_FIELD_ID,
  CAMPANHA_LINK_FIELD_ID,
  METRICAS_ON_CAMPANHA_FIELD_ID,
  VENDAS_ON_CAMPANHA_FIELD_ID,
];

const VIEW_FIELD_IDS = [
  'f7bda322-99da-4eb4-a459-a26bfc04da88',
  '1d993a34-fcd7-4912-9627-16743fa07bb7',
  '34ea014e-f86b-420c-bc0d-143025edb5af',
  'ddf9c699-e6bd-48d8-a3bc-74c2a7dd4d65',
  '06104209-c88d-4bb7-b481-8b26ceb8570d',
  '8d6bbab8-a31d-4f8f-976f-824300b6ad8e',
  '50decb3a-3733-431f-8f58-92ca4ac2d4cc',
  'ac1a302b-7d7a-4dc1-be68-d3aae1785351',
  '32ffa79a-d01e-458e-a58e-b694ec8a75e2',
  '9a383c2a-23bd-4441-ad92-79971425b8c2',
  '09d93680-cee8-488c-a0ae-6d447d2c0154',
  '031f0441-c4fa-4c9e-bd6f-a84062646024',
];

export default defineView({
  universalIdentifier: CAMPANHA_RECORD_FIELDS_VIEW_ID,
  name: 'Campos da campanha',
  objectUniversalIdentifier: CAMPANHA_OBJECT_ID,
  type: ViewType.FIELDS_WIDGET,
  icon: 'IconListDetails',
  position: 0,
  fields: CAMPOS.map((fieldMetadataUniversalIdentifier, index) => ({
    universalIdentifier: VIEW_FIELD_IDS[index],
    fieldMetadataUniversalIdentifier,
    position: index,
    isVisible: true,
    size: 200,
  })),
});
