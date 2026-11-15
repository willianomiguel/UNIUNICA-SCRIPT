import { calcularCpa } from 'src/modules/trafego/utils/calcular-cpa.util';

describe('calcularCpa', () => {
  it('calcula gasto / aquisições', () => expect(calcularCpa(300, 4)).toBe(75));
  it('sem aquisições é null', () => expect(calcularCpa(300, 0)).toBeNull());
});
