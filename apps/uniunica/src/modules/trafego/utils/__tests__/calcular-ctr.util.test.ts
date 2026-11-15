import { calcularCtr } from 'src/modules/trafego/utils/calcular-ctr.util';

describe('calcularCtr', () => {
  it('calcula cliques / impressões em %', () => expect(calcularCtr(25, 1000)).toBe(2.5));
  it('sem impressões é null', () => expect(calcularCtr(5, 0)).toBeNull());
});
