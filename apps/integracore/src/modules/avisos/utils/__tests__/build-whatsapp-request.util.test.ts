import { describe, expect, it } from 'vitest';

import { buildWhatsappRequest } from 'src/modules/avisos/utils/build-whatsapp-request.util';

describe('buildWhatsappRequest', () => {
  it('monta requisição compatível com Evolution API e Z-API', () => {
    expect(
      buildWhatsappRequest(
        { apiUrl: 'https://evo.local/message/sendText/inst', apiToken: 'segredo', authHeader: 'apikey' },
        '+55 (11) 99999-0000',
        'Olá',
      ),
    ).toEqual({
      url: 'https://evo.local/message/sendText/inst',
      headers: { 'Content-Type': 'application/json', apikey: 'segredo' },
      body: { number: '5511999990000', text: 'Olá', phone: '5511999990000', message: 'Olá' },
    });
  });

  it('não envia cabeçalho de token quando o token está vazio', () => {
    const request = buildWhatsappRequest({ apiUrl: 'https://z', apiToken: '', authHeader: 'Client-Token' }, '5511', 'x');

    expect(request.headers).toEqual({ 'Content-Type': 'application/json' });
  });
});
