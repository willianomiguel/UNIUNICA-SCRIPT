import { describe, expect, it } from 'vitest';

import { buildWebhookPayload } from 'src/modules/avisos/utils/build-webhook-payload.util';
import { buildAlertaRule } from 'src/modules/avisos/utils/__tests__/alerta-rule.fixture';

describe('buildWebhookPayload', () => {
  it('monta o JSON genérico com evento, texto e dados da regra', () => {
    expect(
      buildWebhookPayload({
        rule: buildAlertaRule(),
        valor: 2,
        texto: 'msg',
        isTest: true,
        avaliadoEm: '2026-11-15T12:00:00.000Z',
      }),
    ).toEqual({
      evento: 'alerta.teste',
      texto: 'msg',
      alerta: {
        id: 'alerta-1',
        nome: 'Chargeback alto',
        metrica: 'TAXA_CHARGEBACK',
        operador: 'MAIOR_QUE',
        limite: 1,
        janelaDias: 30,
      },
      valor: 2,
      avaliadoEm: '2026-11-15T12:00:00.000Z',
    });
  });

  it('usa alerta.disparado fora de teste', () => {
    expect(
      buildWebhookPayload({ rule: buildAlertaRule(), valor: 1, texto: '', isTest: false, avaliadoEm: '' }).evento,
    ).toBe('alerta.disparado');
  });
});
