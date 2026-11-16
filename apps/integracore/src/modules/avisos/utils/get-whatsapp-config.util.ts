import { type WhatsappConfig } from 'src/modules/avisos/types/whatsapp-config';

// Lê as variáveis do app (process.env no runtime). null = WhatsApp não configurado.
export const getWhatsappConfig = (
  env: Record<string, string | undefined>,
): WhatsappConfig | null => {
  const apiUrl = env.WHATSAPP_API_URL?.trim() ?? '';

  if (apiUrl === '') {
    return null;
  }

  return {
    apiUrl,
    apiToken: env.WHATSAPP_API_TOKEN?.trim() ?? '',
    authHeader: env.WHATSAPP_AUTH_HEADER?.trim() || 'apikey',
  };
};
