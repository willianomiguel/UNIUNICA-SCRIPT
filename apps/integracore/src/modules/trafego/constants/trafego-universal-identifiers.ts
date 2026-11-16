// IDs universais do módulo de tráfego. NUNCA altere um ID depois do primeiro sync.
import { OBJECTS } from 'src/modules/shared/constants/objects';

export const CAMPANHA_OBJECT_ID = OBJECTS.campanha.universalIdentifier;
export const METRICA_TRAFEGO_OBJECT_ID = OBJECTS.metricaTrafego.universalIdentifier;
export const VENDA_OBJECT_ID = OBJECTS.venda.universalIdentifier;

// Campos de campanha
export const CAMPANHA_NOME_FIELD_ID = '07c1a36c-aa06-42b4-b0b6-c22f8497b709';
export const CAMPANHA_PLATAFORMA_FIELD_ID = '0713f2a5-20bc-4f5e-bc71-5822b3510a9b';
export const CAMPANHA_STATUS_FIELD_ID = '5ab37f21-16c9-44ee-9f38-d2b4f0f5fbd9';
export const CAMPANHA_OBJETIVO_FIELD_ID = '3dd7088e-2c67-409e-a4bf-93aab926794a';
export const CAMPANHA_ORCAMENTO_FIELD_ID = '53730c9d-f086-48b5-9046-404d19f97135';
export const CAMPANHA_DATA_INICIO_FIELD_ID = '5a7e1443-ab43-4169-90e4-c5fdc4a22ff9';
export const CAMPANHA_DATA_FIM_FIELD_ID = 'f7cd2b44-97f7-4316-823a-a4e17764ae45';
export const CAMPANHA_UTM_CAMPAIGN_FIELD_ID = 'cb00db5b-58dd-4003-9de6-3f86ea78aaea';
export const CAMPANHA_ID_EXTERNO_FIELD_ID = '29553724-f4bb-48ce-afcb-740deb27772f';
export const CAMPANHA_LINK_FIELD_ID = '74013830-d794-4b8a-b393-5a722f154613';

// Campos de métrica de tráfego
export const METRICA_NOME_FIELD_ID = '1a48b5d7-ef08-4041-a4c4-d849d209f416';
export const METRICA_DATA_FIELD_ID = 'ec20f65e-c5c3-46c4-a7c7-117ba86205ee';
export const METRICA_IMPRESSOES_FIELD_ID = '4005ddba-c1fb-4a64-b2bd-18c740a9ace3';
export const METRICA_CLIQUES_FIELD_ID = '58ef8ee0-2903-4403-b529-1cd1fbf687f2';
export const METRICA_VISITAS_FIELD_ID = '75849a80-c434-4d56-b71d-a74fb8892ace';
export const METRICA_LEADS_FIELD_ID = 'a50864c4-9fdb-4c1d-9056-2998143050c3';
export const METRICA_CONVERSOES_FIELD_ID = 'c55cf908-788b-4dce-9a26-226f72c1eafc';
export const METRICA_GASTO_FIELD_ID = '99fdb664-0fb9-46f5-ae9a-2b7d1cd83490';
export const METRICA_ORIGEM_FIELD_ID = '9fa8456a-8c1c-4044-88dc-bb4b21a24032';
export const METRICA_PAGINA_FIELD_ID = 'de90d5b5-32e1-46af-8924-edb35fcf8eb7';
export const METRICA_CHAVE_FIELD_ID = '3be08296-9c1d-4779-b289-9dd65eff6765';

// Relações
export const CAMPANHA_ON_METRICA_FIELD_ID = '48a9da9d-4ac8-421c-9b56-51804c4d1ca3';
export const METRICAS_ON_CAMPANHA_FIELD_ID = '851d95a0-f7f2-40d6-8257-d29e736e3dac';
export const CAMPANHA_ON_VENDA_FIELD_ID = 'bb8bb35e-0de6-4f42-afc4-1c4d93502962';
export const VENDAS_ON_CAMPANHA_FIELD_ID = '5c71812e-c42d-41a8-9201-df34f78a2e5e';

// Views
export const CAMPANHAS_TODAS_VIEW_ID = '51a2e54c-cebb-436e-8a5c-97136190ab1d';
export const CAMPANHAS_ATIVAS_VIEW_ID = '1c5b3063-3c90-4f0e-b6d6-7c592d8d92ea';
export const CAMPANHAS_POR_PLATAFORMA_VIEW_ID = '68a4ea68-2357-435e-9016-6fa9bb03b544';
export const CAMPANHA_RECORD_FIELDS_VIEW_ID = '17b96786-5bcf-48ac-9a5f-abc8675b750f';
export const METRICAS_DIARIAS_VIEW_ID = '8bbdb2eb-eac5-4c83-b38c-52aff1408772';
export const METRICA_RECORD_FIELDS_VIEW_ID = '2cfe8697-c7c3-4bdf-a0bd-fd844d6b314d';

// Page layouts
export const CAMPANHA_RECORD_PAGE_LAYOUT_ID = 'c528c596-56ab-4720-b418-4cf9ad8e3f43';
export const METRICA_RECORD_PAGE_LAYOUT_ID = 'a8f1d7d2-cb54-49cb-9ee7-34f5f34a3439';
export const PAINEL_TRAFEGO_PAGE_LAYOUT_ID = 'b6428d9d-f36b-49a3-8224-2ba782634693';

// Front components
export const PAINEL_TRAFEGO_FRONT_COMPONENT_ID = '6a965f67-6ee9-47c5-9630-25f1c13f7c19';

// Logic functions
export const INGEST_LOGIC_FUNCTION_ID = '6dd6f4a5-3913-4108-8630-ebfa208be0ad';
export const PIXEL_LOGIC_FUNCTION_ID = 'aed8df69-c08e-4d62-acca-4a6660b19502';
export const META_ADS_SYNC_LOGIC_FUNCTION_ID = 'e0d6b6b3-9c82-48b9-bdeb-0ff1790ae861';
export const VINCULAR_VENDAS_EVENTO_LOGIC_FUNCTION_ID = '2a4bfb8c-0335-4eea-822a-28ae776eb3b6';
export const VINCULAR_VENDAS_CRON_LOGIC_FUNCTION_ID = '368118e4-b0d9-4847-9754-0d3807bc1b5a';

// Variáveis da aplicação
export const META_ADS_ACCESS_TOKEN_VARIABLE_ID = '73032740-d367-4169-baca-4a3132b53ab7';
export const META_ADS_ACCOUNT_ID_VARIABLE_ID = '10f10bee-cad7-4f2b-8236-05bfeab7bf63';
export const TRAFEGO_INGEST_TOKEN_VARIABLE_ID = '09ee864e-2f95-417f-966f-2c218f58da7c';
