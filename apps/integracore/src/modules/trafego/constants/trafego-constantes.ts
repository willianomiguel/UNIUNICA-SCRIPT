// Chave usada para métricas sem campanha nas agregações.
export const SEM_CAMPANHA = 'SEM_CAMPANHA';

// Valor do status de venda (módulo vendas) que conta como receita.
export const STATUS_VENDA_APROVADA = 'APROVADA';

export const FUSO_HORARIO_PADRAO = 'America/Sao_Paulo';

export const META_GRAPH_API_VERSAO = 'v21.0';

// Quantos dias para trás a sincronização do Meta Ads reprocessa (o Meta ajusta números atrasados).
export const META_DIAS_REPROCESSAR = 3;

export const ORIGENS_METRICA = [
  'META_ADS',
  'GOOGLE_ADS',
  'TIKTOK_ADS',
  'SITE',
  'MANUAL',
] as const;

export const PREFIXO_CHAVE_POR_ORIGEM = {
  META_ADS: 'meta',
  GOOGLE_ADS: 'google',
  TIKTOK_ADS: 'tiktok',
  SITE: 'site',
  MANUAL: 'manual',
} as const;

export const ROTULO_ORIGEM_METRICA = {
  META_ADS: 'Meta Ads',
  GOOGLE_ADS: 'Google Ads',
  TIKTOK_ADS: 'TikTok Ads',
  SITE: 'Site',
  MANUAL: 'Manual',
} as const;

export const ROTULO_PLATAFORMA: Record<string, string> = {
  META_ADS: 'Meta Ads',
  GOOGLE_ADS: 'Google Ads',
  TIKTOK_ADS: 'TikTok Ads',
  ORGANICO: 'Orgânico',
  EMAIL: 'E-mail',
  INFLUENCIADOR: 'Influenciador',
  OUTRO: 'Outro',
  SITE: 'Site',
  MANUAL: 'Manual',
};

// Tipos de ação do Meta, em ordem de preferência (o primeiro presente vale; evita contar em dobro).
export const META_ACOES_LEAD = [
  'lead',
  'onsite_conversion.lead_grouped',
  'offsite_conversion.fb_pixel_lead',
];

export const META_ACOES_CONVERSAO = [
  'purchase',
  'omni_purchase',
  'offsite_conversion.fb_pixel_purchase',
];

export const META_ACOES_VISITA = ['landing_page_view', 'omni_landing_page_view'];
