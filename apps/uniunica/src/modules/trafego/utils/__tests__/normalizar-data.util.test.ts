import { describe, expect, it } from 'vitest';

import { normalizarData } from 'src/modules/trafego/utils/normalizar-data.util';

describe('normalizarData', () => {
  it('aceita AAAA-MM-DD e ISO', () => {
    expect(normalizarData('2026-11-14')).toBe('2026-11-14');
    expect(normalizarData('2026-11-14T10:00:00Z')).toBe('2026-11-14');
  });
  it('aceita DD/MM/AAAA', () => expect(normalizarData('14/11/2026')).toBe('2026-11-14'));
  it('rejeita datas impossíveis ou formatos errados', () => {
    expect(normalizarData('2026-02-30')).toBeNull();
    expect(normalizarData('ontem')).toBeNull();
    expect(normalizarData(20261114)).toBeNull();
  });
});
