import { describe, expect, it } from 'vitest';

import { paraNumero } from 'src/modules/trafego/utils/para-numero.util';

describe('paraNumero', () => {
  it('mantém números', () => expect(paraNumero(12.5)).toBe(12.5));
  it('lê string com ponto', () => expect(paraNumero('1234.56')).toBe(1234.56));
  it('lê formato brasileiro', () => {
    expect(paraNumero('1.234,56')).toBe(1234.56);
    expect(paraNumero('R$ 10,50')).toBe(10.5);
  });
  it('inválido vira 0', () => {
    expect(paraNumero('abc')).toBe(0);
    expect(paraNumero(null)).toBe(0);
    expect(paraNumero(Number.NaN)).toBe(0);
    expect(paraNumero('')).toBe(0);
  });
});
