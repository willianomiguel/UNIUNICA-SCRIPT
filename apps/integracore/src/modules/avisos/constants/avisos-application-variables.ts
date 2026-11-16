import { type defineApplication } from 'integra-sdk/define';

import { AVISOS_UNIVERSAL_IDENTIFIERS } from 'src/modules/avisos/constants/avisos-universal-identifiers';

type ApplicationVariables = NonNullable<
  Parameters<typeof defineApplication>[0]['applicationVariables']
>;

const IDS = AVISOS_UNIVERSAL_IDENTIFIERS.applicationVariables;

// Variáveis do módulo avisos, para o integrador juntar em defineApplication({ applicationVariables }).
const AVISOS_APPLICATION_VARIABLES: ApplicationVariables = {
  WHATSAPP_API_URL: {
    universalIdentifier: IDS.whatsappApiUrl,
    label: 'WhatsApp: URL de envio de texto',
    description:
      'Endpoint "enviar texto" do seu provedor de WhatsApp. Evolution API: https://SEU-HOST/message/sendText/SUA-INSTANCIA · Z-API: https://api.z-api.io/instances/ID/token/TOKEN/send-text. Deixe vazio para não usar WhatsApp.',
    isSecret: false,
    value: '',
  },
  WHATSAPP_API_TOKEN: {
    universalIdentifier: IDS.whatsappApiToken,
    label: 'WhatsApp: token da API',
    description:
      'Chave enviada no cabeçalho definido em WHATSAPP_AUTH_HEADER (Evolution: apikey da instância; Z-API: Client-Token da conta).',
    isSecret: true,
  },
  WHATSAPP_AUTH_HEADER: {
    universalIdentifier: IDS.whatsappAuthHeader,
    label: 'WhatsApp: cabeçalho do token',
    description:
      'Nome do cabeçalho HTTP que leva o token. Padrão "apikey" (Evolution API). Use "Client-Token" para Z-API ou "Authorization" (com o token no formato "Bearer xxx") para outros provedores.',
    isSecret: false,
    value: 'apikey',
  },
};

export default AVISOS_APPLICATION_VARIABLES;
