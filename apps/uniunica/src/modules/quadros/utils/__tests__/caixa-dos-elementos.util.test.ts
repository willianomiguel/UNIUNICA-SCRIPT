import { describe, expect, it } from 'vitest';

import { caixaDosElementos } from 'src/modules/quadros/utils/caixa-dos-elementos.util';

describe('caixaDosElementos', () => {
  it('devolve null sem elementos e a união das caixas com eles', () => {
    expect(caixaDosElementos([])).toBeNull();
    expect(
      caixaDosElementos([
        { id: 'a', tipo: 'nota', x: 10, y: 20, largura: 100, altura: 50, cor: 'blue', z: 0, texto: '' },
        { id: 'b', tipo: 'nota', x: -5, y: 100, largura: 10, altura: 10, cor: 'blue', z: 0, texto: '' },
      ]),
    ).toEqual({ x: -5, y: 20, largura: 115, altura: 90 });
  });
});
