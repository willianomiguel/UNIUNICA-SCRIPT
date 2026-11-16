import { describe, expect, it } from 'vitest';

import { calcularCpl } from 'src/modules/trafego/utils/calcular-cpl.util';

describe('calcularCpl', () => {
  it('calcula gasto / leads', () => expect(calcularCpl(90, 9)).toBe(10));
  it('sem leads é null', () => expect(calcularCpl(90, 0)).toBeNull());
});
