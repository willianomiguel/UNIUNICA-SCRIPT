import { describe, expect, it } from 'vitest';

import { calcularCpm } from 'src/modules/trafego/utils/calcular-cpm.util';

describe('calcularCpm', () => {
  it('calcula custo por mil impressões', () => expect(calcularCpm(50, 10000)).toBe(5));
  it('sem impressões é null', () => expect(calcularCpm(50, 0)).toBeNull());
});
