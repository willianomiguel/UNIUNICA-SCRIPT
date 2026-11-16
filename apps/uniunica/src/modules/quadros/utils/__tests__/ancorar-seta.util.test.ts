import { describe, expect, it } from 'vitest';

import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { atualizarSetasLigadas, pontoNaBorda } from 'src/modules/quadros/utils/ancorar-seta.util';

describe('ancorar-seta', () => {
  it('ponto na borda do retângulo (com folga de 4px)', () => {
    const caixa = { x: 0, y: 0, largura: 100, altura: 50 };

    expect(pontoNaBorda(caixa, [500, 25])).toEqual([104, 25]);
    expect(pontoNaBorda(caixa, [50, -500])).toEqual([50, -4]);
  });

  it('ponto na borda da elipse', () => {
    const [x, y] = pontoNaBorda({ x: 0, y: 0, largura: 100, altura: 100, tipo: 'elipse' }, [50, 1000]);

    expect(x).toBeCloseTo(50);
    expect(y).toBeCloseTo(104);
  });

  it('seta presa acompanha as formas ao mover', () => {
    const elementos: ElementoQuadro[] = [
      { id: 'a', tipo: 'retangulo', x: 0, y: 0, largura: 100, altura: 50, cor: 'blue', z: 1, texto: '' },
      { id: 'b', tipo: 'retangulo', x: 300, y: 0, largura: 100, altura: 50, cor: 'blue', z: 2, texto: '' },
      { id: 's', tipo: 'seta', pontos: [[0, 0], [1, 1]], deId: 'a', paraId: 'b', x: 0, y: 0, largura: 1, altura: 1, cor: 'gray', z: 3 },
    ];
    const seta = atualizarSetasLigadas(elementos)[2];

    expect(seta.tipo === 'seta' && seta.pontos).toEqual([[104, 25], [296, 25]]);
    expect(seta).toMatchObject({ x: 104, y: 25, largura: 192, altura: 0 });
  });

  it('seta solta não muda', () => {
    const seta: ElementoQuadro = {
      id: 's', tipo: 'seta', pontos: [[0, 0], [9, 9]], x: 0, y: 0, largura: 9, altura: 9, cor: 'gray', z: 1,
    };

    expect(atualizarSetasLigadas([seta])[0]).toBe(seta);
  });
});
