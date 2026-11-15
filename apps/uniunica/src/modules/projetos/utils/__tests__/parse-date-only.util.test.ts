import { describe, expect, it } from 'vitest';

import { parseDateOnly } from 'src/modules/projetos/utils/parse-date-only.util';

describe('parseDateOnly', () => {
  it('converte AAAA-MM-DD em meia-noite UTC', () => {
    expect(parseDateOnly('2026-11-15')).toBe(Date.UTC(2026, 10, 15));
  });

  it('aceita ISO com hora e ignora a hora', () => {
    expect(parseDateOnly('2026-01-02T23:59:00.000Z')).toBe(Date.UTC(2026, 0, 2));
  });

  it('devolve null para vazio, texto inválido ou data impossível', () => {
    expect(parseDateOnly(null)).toBeNull();
    expect(parseDateOnly(undefined)).toBeNull();
    expect(parseDateOnly('')).toBeNull();
    expect(parseDateOnly('15/11/2026')).toBeNull();
    expect(parseDateOnly('2026-02-31')).toBeNull();
  });
});
