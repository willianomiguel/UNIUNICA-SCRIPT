import { describe, expect, it } from 'vitest';

import { decideAlertaAction } from 'src/modules/avisos/utils/decide-alerta-action.util';
import { buildAlertaRule } from 'src/modules/avisos/utils/__tests__/alerta-rule.fixture';

const NOW = new Date('2026-11-15T12:00:00Z');

describe('decideAlertaAction', () => {
  it('envia quando a condição é atingida e não há cooldown', () => {
    expect(decideAlertaAction(buildAlertaRule(), 1.5, NOW)).toEqual({ action: 'SEND' });
  });

  it('ignora quando a condição não é atingida', () => {
    expect(decideAlertaAction(buildAlertaRule(), 0.5, NOW)).toEqual({
      action: 'SKIP',
      reason: 'CONDICAO_NAO_ATINGIDA',
    });
  });

  it('respeita o cooldown', () => {
    expect(
      decideAlertaAction(buildAlertaRule({ ultimoDisparo: '2026-11-15T10:00:00Z' }), 5, NOW),
    ).toEqual({ action: 'SKIP', reason: 'EM_COOLDOWN' });
  });

  it('ignora regra sem limite', () => {
    expect(decideAlertaAction(buildAlertaRule({ limite: null }), 5, NOW)).toEqual({
      action: 'SKIP',
      reason: 'SEM_LIMITE',
    });
  });
});
