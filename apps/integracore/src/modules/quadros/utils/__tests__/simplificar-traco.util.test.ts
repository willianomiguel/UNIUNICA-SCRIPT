import { describe, expect, it } from 'vitest';

import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';
import { simplificarTraco } from 'src/modules/quadros/utils/simplificar-traco.util';

describe('simplificarTraco', () => {
  it('reta cheia de pontos vira só as duas pontas', () => {
    const reta: PontoQuadro[] = Array.from({ length: 50 }, (_, indice) => [indice, indice * 2]);

    expect(simplificarTraco(reta)).toEqual([[0, 0], [49, 98]]);
  });

  it('mantém as quinas', () => {
    const quina: PontoQuadro[] = [[0, 0], [5, 0], [10, 0], [10, 5], [10, 10]];

    expect(simplificarTraco(quina)).toEqual([[0, 0], [10, 0], [10, 10]]);
  });

  it('com até dois pontos devolve uma cópia', () => {
    const pontos: PontoQuadro[] = [[1, 2]];

    expect(simplificarTraco(pontos)).toEqual([[1, 2]]);
    expect(simplificarTraco(pontos)).not.toBe(pontos);
  });
});
