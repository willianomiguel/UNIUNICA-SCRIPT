import { describe, expect, it } from 'vitest';

import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { distanciaPontoSegmento, elementoNoPonto } from 'src/modules/quadros/utils/testar-acerto-quadro.util';

const retangulo = (id: string, z: number): ElementoQuadro => ({
  id, tipo: 'retangulo', x: 0, y: 0, largura: 100, altura: 100, cor: 'blue', z, texto: '',
});

describe('testar-acerto-quadro', () => {
  it('distância de ponto a segmento', () => {
    expect(distanciaPontoSegmento([5, 5], [0, 0], [10, 0])).toBe(5);
    expect(distanciaPontoSegmento([-3, 4], [0, 0], [10, 0])).toBe(5);
  });

  it('escolhe o elemento de maior z sob o ponto e null no vazio', () => {
    const lista = [retangulo('baixo', 1), retangulo('cima', 2)];

    expect(elementoNoPonto(lista, [50, 50])?.id).toBe('cima');
    expect(elementoNoPonto(lista, [500, 500])).toBeNull();
  });

  it('elipse não acerta no canto da caixa', () => {
    const elipse: ElementoQuadro = {
      id: 'e', tipo: 'elipse', x: 0, y: 0, largura: 100, altura: 100, cor: 'blue', z: 1, texto: '',
    };

    expect(elementoNoPonto([elipse], [50, 50], 0)?.id).toBe('e');
    expect(elementoNoPonto([elipse], [2, 2], 0)).toBeNull();
  });

  it('seta e traço acertam perto da linha, não no meio da caixa', () => {
    const seta: ElementoQuadro = {
      id: 's', tipo: 'seta', pontos: [[0, 0], [100, 100]], x: 0, y: 0, largura: 100, altura: 100, cor: 'gray', z: 1,
    };

    expect(elementoNoPonto([seta], [52, 50], 4)?.id).toBe('s');
    expect(elementoNoPonto([seta], [90, 10], 4)).toBeNull();
  });

  it('respeita o filtro', () => {
    expect(elementoNoPonto([retangulo('a', 1)], [50, 50], 6, () => false)).toBeNull();
  });
});
