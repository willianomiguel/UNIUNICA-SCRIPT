import { describe, expect, it } from 'vitest';

import { calcularCpc } from 'src/modules/trafego/utils/calcular-cpc.util';

describe('calcularCpc', () => {
  it('calcula gasto / cliques', () => expect(calcularCpc(100, 40)).toBe(2.5));
  it('sem cliques é null', () => expect(calcularCpc(100, 0)).toBeNull());
});
