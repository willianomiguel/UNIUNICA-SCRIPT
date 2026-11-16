import { type HttpRequestSpec } from 'src/modules/avisos/types/http-request-spec';
import { type WhatsappConfig } from 'src/modules/avisos/types/whatsapp-config';

// Corpo com as chaves das APIs mais comuns: Evolution API ({ number, text }) e Z-API ({ phone, message }).
export const buildWhatsappRequest = (
  config: WhatsappConfig,
  telefone: string,
  texto: string,
): HttpRequestSpec => {
  const phone = telefone.replace(/\D/g, '');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (config.apiToken !== '') {
    headers[config.authHeader || 'apikey'] = config.apiToken;
  }

  return {
    url: config.apiUrl,
    headers,
    body: { number: phone, text: texto, phone, message: texto },
  };
};
