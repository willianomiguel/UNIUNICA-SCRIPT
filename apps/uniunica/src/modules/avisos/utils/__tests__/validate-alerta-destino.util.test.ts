import { describe, expect, it } from 'vitest';

import { validateAlertaDestino } from 'src/modules/avisos/utils/validate-alerta-destino.util';

describe('validateAlertaDestino', () => {
  it('aceita URLs para canais de webhook', () => {
    expect(validateAlertaDestino('SLACK', 'https://hooks.slack.com/services/x')).toBeNull();
    expect(validateAlertaDestino('WEBHOOK', 'http://172.17.0.1:4000/hook')).toBeNull();
  });

  it('rejeita destino ausente, canal ausente e URL inválida', () => {
    expect(validateAlertaDestino('DISCORD', '')).toMatch(/destino/);
    expect(validateAlertaDestino(null, 'https://x.y')).toMatch(/canal/);
    expect(validateAlertaDestino('SLACK', 'ftp://x')).toMatch(/URL/);
    expect(validateAlertaDestino('SLACK', 'não é url')).toMatch(/URL/);
  });

  it('valida telefone para WhatsApp', () => {
    expect(validateAlertaDestino('WHATSAPP', '+55 (11) 99999-9999')).toBeNull();
    expect(validateAlertaDestino('WHATSAPP', '1234')).toMatch(/telefone/);
  });
});
