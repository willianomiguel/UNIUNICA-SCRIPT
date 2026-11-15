import { describe, expect, it } from 'vitest';

import { getWhatsappConfig } from 'src/modules/avisos/utils/get-whatsapp-config.util';

describe('getWhatsappConfig', () => {
  it('retorna null sem URL', () => {
    expect(getWhatsappConfig({})).toBeNull();
    expect(getWhatsappConfig({ WHATSAPP_API_URL: '  ' })).toBeNull();
  });

  it('lê URL, token e cabeçalho (padrão apikey)', () => {
    expect(getWhatsappConfig({ WHATSAPP_API_URL: 'https://x', WHATSAPP_API_TOKEN: ' t ' })).toEqual({
      apiUrl: 'https://x',
      apiToken: 't',
      authHeader: 'apikey',
    });
    expect(
      getWhatsappConfig({ WHATSAPP_API_URL: 'https://x', WHATSAPP_AUTH_HEADER: 'Client-Token' })?.authHeader,
    ).toBe('Client-Token');
  });
});
