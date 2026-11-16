import { describe, expect, it } from 'vitest';

import { dividirSeguro } from 'src/modules/trafego/utils/dividir-seguro.util';

describe('dividirSeguro', () => {
  it('divide normalmente', () => expect(dividirSeguro(10, 4)).toBe(2.5));
  it('devolve null com denominador zero ou negativo', () => {
    expect(dividirSeguro(10, 0)).toBeNull();
    expect(dividirSeguro(10, -1)).toBeNull();
  });
  it('devolve null com valores inválidos', () => {
    expect(dividirSeguro(Number.NaN, 2)).toBeNull();
    expect(dividirSeguro(1, Number.POSITIVE_INFINITY)).toBeNull();
  });
});
