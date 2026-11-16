import { describe, expect, it } from 'vitest';

import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { aplicarCaixa, posicaoDaAlca, redimensionarCaixa } from 'src/modules/quadros/utils/redimensionar-elemento.util';

const caixa = { x: 100, y: 100, largura: 200, altura: 100 };

describe('redimensionar-elemento', () => {
  it('posição das alças', () => {
    expect(posicaoDaAlca(caixa, 'no')).toEqual([100, 100]);
    expect(posicaoDaAlca(caixa, 'se')).toEqual([300, 200]);
  });

  it('arrastar o canto sudeste aumenta mantendo o noroeste fixo', () => {
    expect(redimensionarCaixa(caixa, 'se', [350, 260])).toEqual({ x: 100, y: 100, largura: 250, altura: 160 });
  });

  it('arrastar o canto noroeste mantém o sudeste fixo', () => {
    expect(redimensionarCaixa(caixa, 'no', [50, 80])).toEqual({ x: 50, y: 80, largura: 250, altura: 120 });
  });

  it('não deixa ficar menor que o mínimo nem inverter', () => {
    expect(redimensionarCaixa(caixa, 'se', [0, 0], 8)).toEqual({ x: 100, y: 100, largura: 8, altura: 8 });
  });

  it('traço tem os pontos escalados junto com a caixa', () => {
    const traco: ElementoQuadro = {
      id: 't', tipo: 'traco', pontos: [[0, 0], [10, 10]], x: 0, y: 0, largura: 10, altura: 10, cor: 'gray', z: 1,
    };
    const novo = aplicarCaixa(traco, { x: 0, y: 0, largura: 20, altura: 40 });

    expect(novo.tipo === 'traco' && novo.pontos).toEqual([[0, 0], [20, 40]]);
  });
});
