import { describe, expect, it } from 'vitest';

import { isAlertaInCooldown } from 'src/modules/avisos/utils/is-alerta-in-cooldown.util';

const NOW = new Date('2026-11-15T12:00:00Z');

describe('isAlertaInCooldown', () => {
  it('fica em cooldown antes de passar o intervalo', () => {
    expect(isAlertaInCooldown('2026-11-15T00:00:01Z', 12, NOW)).toBe(true);
  });

  it('libera quando o intervalo passou', () => {
    expect(isAlertaInCooldown('2026-11-15T00:00:00Z', 12, NOW)).toBe(false);
  });

  it('sem disparo anterior, cooldown zero ou data inválida => liberado', () => {
    expect(isAlertaInCooldown(null, 24, NOW)).toBe(false);
    expect(isAlertaInCooldown('2026-11-15T11:59:00Z', 0, NOW)).toBe(false);
    expect(isAlertaInCooldown('ontem', 24, NOW)).toBe(false);
  });
});
