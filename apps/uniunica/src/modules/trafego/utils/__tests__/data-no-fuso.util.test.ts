import { describe, expect, it } from 'vitest';

import { dataNoFuso } from 'src/modules/trafego/utils/data-no-fuso.util';

describe('dataNoFuso', () => {
  it('usa o horário de Brasília por padrão', () => {
    // 02:00 UTC do dia 15 ainda é dia 14 em São Paulo (UTC-3)
    expect(dataNoFuso(new Date('2026-11-15T02:00:00Z'))).toBe('2026-11-14');
  });
  it('aceita outro fuso', () => {
    expect(dataNoFuso(new Date('2026-11-15T02:00:00Z'), 'UTC')).toBe('2026-11-15');
  });
});
