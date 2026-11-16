import { defineView, ViewType } from 'integra-sdk/define';

import {
  CAMPANHA_ON_METRICA_FIELD_ID,
  METRICA_CHAVE_FIELD_ID,
  METRICA_CLIQUES_FIELD_ID,
  METRICA_CONVERSOES_FIELD_ID,
  METRICA_DATA_FIELD_ID,
  METRICA_GASTO_FIELD_ID,
  METRICA_IMPRESSOES_FIELD_ID,
  METRICA_LEADS_FIELD_ID,
  METRICA_NOME_FIELD_ID,
  METRICA_ORIGEM_FIELD_ID,
  METRICA_PAGINA_FIELD_ID,
  METRICA_RECORD_FIELDS_VIEW_ID,
  METRICA_TRAFEGO_OBJECT_ID,
  METRICA_VISITAS_FIELD_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

const CAMPOS = [
  METRICA_NOME_FIELD_ID,
  METRICA_DATA_FIELD_ID,
  CAMPANHA_ON_METRICA_FIELD_ID,
  METRICA_ORIGEM_FIELD_ID,
  METRICA_GASTO_FIELD_ID,
  METRICA_IMPRESSOES_FIELD_ID,
  METRICA_CLIQUES_FIELD_ID,
  METRICA_VISITAS_FIELD_ID,
  METRICA_LEADS_FIELD_ID,
  METRICA_CONVERSOES_FIELD_ID,
  METRICA_PAGINA_FIELD_ID,
  METRICA_CHAVE_FIELD_ID,
];

const VIEW_FIELD_IDS = [
  'c3407fb5-d5be-4119-8f33-15ab78b82bed',
  '0d96d38b-368f-4b31-90de-684f4a985bbe',
  'ec8d82ac-e23c-434a-9222-9aee2a8dec6a',
  '17265cae-0a24-482d-bda6-3dddcd29b058',
  'f5b0a06c-be34-4262-a26e-f65162dd8533',
  '5c7f7a66-c7c2-4ec8-b9d3-61195a5263ca',
  '08409aa0-c5cf-4977-8c90-973f5703f3b1',
  'a5001e6f-a0c4-4ef0-8c51-c61dccfd223a',
  '7170c0cc-ac03-483a-85af-fdcc775cecb5',
  '1ff8715f-4066-45ef-aceb-ba386c534c46',
  '08d26801-a1e3-4fc5-9304-035e684bd874',
  '44758826-9160-46d8-bf65-91c289cd2ac2',
];

export default defineView({
  universalIdentifier: METRICA_RECORD_FIELDS_VIEW_ID,
  name: 'Campos da métrica',
  objectUniversalIdentifier: METRICA_TRAFEGO_OBJECT_ID,
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
