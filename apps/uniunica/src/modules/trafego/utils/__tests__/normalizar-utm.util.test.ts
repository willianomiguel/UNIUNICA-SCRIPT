import { describe, expect, it } from 'vitest';

import { normalizarUtm } from 'src/modules/trafego/utils/normalizar-utm.util';

describe('normalizarUtm', () => {
  it('minúsculas, sem acento e sem espaços nas pontas', () => {
    expect(normalizarUtm('  Promoção-Verão ')).toBe('promocao-verao');
  });
  it('vazio ou não texto vira null', () => {
    expect(normalizarUtm('   ')).toBeNull();
    expect(normalizarUtm(undefined)).toBeNull();
    expect(normalizarUtm(12)).toBeNull();
  });
});
