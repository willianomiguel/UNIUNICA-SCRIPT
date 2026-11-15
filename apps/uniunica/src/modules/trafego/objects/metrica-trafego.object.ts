import { defineObject, FieldType } from 'twenty-sdk/define';

import { OBJECTS } from 'src/modules/shared/constants/objects';
import {
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
  METRICA_VISITAS_FIELD_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

export const ORIGEM_METRICA_OPTIONS = [
  { id: 'ba851e5b-688b-4a8f-ad2e-5d1dbb933195', value: 'META_ADS', label: 'Meta Ads', position: 0, color: 'blue' },
  { id: '5d8fbc54-9a2a-4634-a47b-4962080df098', value: 'GOOGLE_ADS', label: 'Google Ads', position: 1, color: 'red' },
  { id: '601226c8-c57d-4c77-aa03-deaaa369e470', value: 'TIKTOK_ADS', label: 'TikTok Ads', position: 2, color: 'purple' },
  { id: '268f39eb-4644-42ef-9163-00d33e99174d', value: 'SITE', label: 'Site (pixel)', position: 3, color: 'green' },
  { id: '46c4bea6-d1b4-464f-bf98-e08c55ba9b08', value: 'MANUAL', label: 'Manual', position: 4, color: 'gray' },
] as const;

const numero = (universalIdentifier: string, name: string, label: string, icon: string, description: string) => ({
  universalIdentifier,
  type: FieldType.NUMBER as const,
  name,
  label,
  description,
  icon,
  isNullable: true,
  defaultValue: 0,
  settings: { decimals: 0, type: 'number' as const },
});

export default defineObject({
  universalIdentifier: OBJECTS.metricaTrafego.universalIdentifier,
  nameSingular: OBJECTS.metricaTrafego.nameSingular,
  namePlural: OBJECTS.metricaTrafego.namePlural,
  labelSingular: 'Métrica de tráfego',
  labelPlural: 'Métricas de tráfego',
  description: 'Números de um dia de uma campanha (ou de uma página do site)',
  icon: 'IconChartLine',
  labelIdentifierFieldMetadataUniversalIdentifier: METRICA_NOME_FIELD_ID,
  fields: [
    {
      universalIdentifier: METRICA_NOME_FIELD_ID,
      type: FieldType.TEXT,
      name: 'nome',
      label: 'Descrição',
      description: 'Resumo da linha, ex.: "Meta Ads · Black Friday · 2026-11-10"',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: METRICA_DATA_FIELD_ID,
      type: FieldType.DATE,
      name: 'data',
      label: 'Data',
      icon: 'IconCalendar',
      isNullable: true,
    },
    numero(METRICA_IMPRESSOES_FIELD_ID, 'impressoes', 'Impressões', 'IconEye', 'Vezes que o anúncio apareceu'),
    numero(METRICA_CLIQUES_FIELD_ID, 'cliques', 'Cliques', 'IconClick', 'Cliques no anúncio ou no link'),
    numero(METRICA_VISITAS_FIELD_ID, 'visitas', 'Visitas', 'IconWorld', 'Visitas na página'),
    numero(METRICA_LEADS_FIELD_ID, 'leads', 'Leads', 'IconUserPlus', 'Cadastros / contatos gerados'),
    numero(METRICA_CONVERSOES_FIELD_ID, 'conversoes', 'Conversões', 'IconShoppingCart', 'Compras ou conversões informadas pela plataforma'),
    {
      universalIdentifier: METRICA_GASTO_FIELD_ID,
      type: FieldType.CURRENCY,
      name: 'gasto',
      label: 'Gasto',
      description: 'Valor investido no dia (BRL)',
      icon: 'IconCurrencyReal',
      isNullable: true,
      defaultValue: { amountMicros: null, currencyCode: "'BRL'" },
    },
    {
      universalIdentifier: METRICA_ORIGEM_FIELD_ID,
      type: FieldType.SELECT,
      name: 'origem',
      label: 'Origem',
      description: 'De onde veio o dado',
      icon: 'IconPlug',
      isNullable: true,
      defaultValue: "'MANUAL'",
      options: [...ORIGEM_METRICA_OPTIONS],
    },
    {
      universalIdentifier: METRICA_PAGINA_FIELD_ID,
      type: FieldType.TEXT,
      name: 'pagina',
      label: 'Página',
      description: 'Página do site (para cliques/visitas do pixel)',
      icon: 'IconFileText',
      isNullable: true,
    },
    {
      universalIdentifier: METRICA_CHAVE_FIELD_ID,
      type: FieldType.TEXT,
      name: 'chave',
      label: 'Chave',
      description: 'Chave única da linha (ex.: meta:<id>:<data>) — evita duplicar ao reenviar',
      icon: 'IconKey',
      isNullable: true,
    },
  ],
});
