import { defineView, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  CAMPANHA_ON_METRICA_FIELD_ID,
  METRICA_CLIQUES_FIELD_ID,
  METRICA_CONVERSOES_FIELD_ID,
  METRICA_DATA_FIELD_ID,
  METRICA_GASTO_FIELD_ID,
  METRICA_IMPRESSOES_FIELD_ID,
  METRICA_LEADS_FIELD_ID,
  METRICA_NOME_FIELD_ID,
  METRICA_ORIGEM_FIELD_ID,
  METRICA_PAGINA_FIELD_ID,
  METRICA_TRAFEGO_OBJECT_ID,
  METRICA_VISITAS_FIELD_ID,
  METRICAS_DIARIAS_VIEW_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

export default defineView({
  universalIdentifier: METRICAS_DIARIAS_VIEW_ID,
  name: 'Métricas diárias',
  objectUniversalIdentifier: METRICA_TRAFEGO_OBJECT_ID,
  type: ViewType.TABLE,
  icon: 'IconCalendarStats',
  position: 0,
  fields: [
    { universalIdentifier: '481aebec-702f-4141-a42d-15a00d1b710e', fieldMetadataUniversalIdentifier: METRICA_NOME_FIELD_ID, position: 0, isVisible: true, size: 280 },
    { universalIdentifier: 'c768a9c8-8fe7-49ec-bc0f-997233ef00c6', fieldMetadataUniversalIdentifier: METRICA_DATA_FIELD_ID, position: 1, isVisible: true, size: 120 },
    { universalIdentifier: '8e8fbb4a-c21f-4a94-8001-31d526a7a0b0', fieldMetadataUniversalIdentifier: CAMPANHA_ON_METRICA_FIELD_ID, position: 2, isVisible: true, size: 200 },
    { universalIdentifier: '1f05017d-5b9e-4757-951f-ef3b7a9c182a', fieldMetadataUniversalIdentifier: METRICA_ORIGEM_FIELD_ID, position: 3, isVisible: true, size: 130 },
    { universalIdentifier: 'ecf88eb4-0d1c-4f81-ac35-0ba4b6dc4b85', fieldMetadataUniversalIdentifier: METRICA_GASTO_FIELD_ID, position: 4, isVisible: true, size: 130 },
    { universalIdentifier: '0386b55d-d5c8-469b-9eca-52c377a6eddb', fieldMetadataUniversalIdentifier: METRICA_IMPRESSOES_FIELD_ID, position: 5, isVisible: true, size: 120 },
    { universalIdentifier: '5a0f4c99-5863-40a7-a198-319e91c55820', fieldMetadataUniversalIdentifier: METRICA_CLIQUES_FIELD_ID, position: 6, isVisible: true, size: 100 },
    { universalIdentifier: '47152e4a-9998-4e31-be38-19c0640ee071', fieldMetadataUniversalIdentifier: METRICA_VISITAS_FIELD_ID, position: 7, isVisible: true, size: 100 },
    { universalIdentifier: 'c7a2dfec-d4f0-4ca8-90ce-605b8b421bb6', fieldMetadataUniversalIdentifier: METRICA_LEADS_FIELD_ID, position: 8, isVisible: true, size: 100 },
    { universalIdentifier: '0c746baa-5185-4f22-96e7-a335185b6da7', fieldMetadataUniversalIdentifier: METRICA_CONVERSOES_FIELD_ID, position: 9, isVisible: true, size: 110 },
    { universalIdentifier: 'bc1eeae8-fc4d-45cf-b0e5-00b27ad7983e', fieldMetadataUniversalIdentifier: METRICA_PAGINA_FIELD_ID, position: 10, isVisible: true, size: 160 },
  ],
  sorts: [
    { universalIdentifier: 'fe3ee5a8-0bb4-4b66-9161-792469ac01c0', fieldMetadataUniversalIdentifier: METRICA_DATA_FIELD_ID, direction: ViewSortDirection.DESC },
  ],
});
