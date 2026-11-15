import {
  META_ADS_ACCESS_TOKEN_VARIABLE_ID,
  META_ADS_ACCOUNT_ID_VARIABLE_ID,
  TRAFEGO_INGEST_TOKEN_VARIABLE_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

// Fragmento de `applicationVariables` do defineApplication — o integrador junta no application-config.ts.
export default {
  META_ADS_ACCESS_TOKEN: {
    universalIdentifier: META_ADS_ACCESS_TOKEN_VARIABLE_ID,
    label: 'Meta Ads — token de acesso',
    description:
      'Token de acesso (usuário do sistema do Business Manager) com permissão ads_read. Sem ele, a sincronização diária do Meta Ads é ignorada.',
    isSecret: true,
  },
  META_ADS_ACCOUNT_ID: {
    universalIdentifier: META_ADS_ACCOUNT_ID_VARIABLE_ID,
    label: 'Meta Ads — ID da conta de anúncios',
    description: 'ID da conta de anúncios (com ou sem o prefixo act_), ex.: act_1234567890.',
    value: '',
  },
  TRAFEGO_INGEST_TOKEN: {
    universalIdentifier: TRAFEGO_INGEST_TOKEN_VARIABLE_ID,
    label: 'Tráfego — token do endpoint de ingestão',
    description:
      'Se preenchido, o endpoint de ingestão de métricas exige este token (cabeçalho x-trafego-token ou ?token=). Deixe vazio para aceitar sem token.',
    isSecret: true,
  },
};
