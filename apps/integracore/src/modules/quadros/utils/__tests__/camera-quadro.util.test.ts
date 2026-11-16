import { describe, expect, it } from 'vitest';

import {
  ajustarCameraACaixa,
  clienteParaTela,
  moverCamera,
  quadroParaTela,
  telaParaQuadro,
  zoomNoPonto,
} from 'src/modules/quadros/utils/camera-quadro.util';

describe('camera-quadro', () => {
  // Regressão: o sandbox manda offsetX = 0; a posição precisa vir de clientX menos o canto da área.
  it('converte clientX/Y em ponto da área usando o canto dela', () => {
    expect(clienteParaTela([960, 480], [237, 129])).toEqual([723, 351]);
  });

  it('converte tela ↔ quadro com pan e zoom', () => {
    const camera = { x: 100, y: 50, zoom: 2 };

    expect(telaParaQuadro([20, 40], camera)).toEqual([110, 70]);
    expect(quadroParaTela([110, 70], camera)).toEqual([20, 40]);
  });

  it('zoom no cursor mantém parado o ponto sob o cursor', () => {
    const camera = { x: 10, y: 20, zoom: 1 };
    const cursor: [number, number] = [300, 200];
    const antes = telaParaQuadro(cursor, camera);
    const depois = zoomNoPonto(camera, cursor, 2.5);

    expect(depois.zoom).toBe(2.5);
    expect(telaParaQuadro(cursor, depois)[0]).toBeCloseTo(antes[0]);
    expect(telaParaQuadro(cursor, depois)[1]).toBeCloseTo(antes[1]);
  });

  it('limita o zoom entre 10% e 400%', () => {
    expect(zoomNoPonto({ x: 0, y: 0, zoom: 1 }, [0, 0], 50).zoom).toBe(4);
    expect(zoomNoPonto({ x: 0, y: 0, zoom: 1 }, [0, 0], 0.001).zoom).toBe(0.1);
  });

  it('pan arrasta o quadro junto com o mouse', () => {
    expect(moverCamera({ x: 0, y: 0, zoom: 2 }, 40, -20)).toEqual({ x: -20, y: 10, zoom: 2 });
  });

  it('ajustar à tela centraliza e não amplia além de 100%', () => {
    const pequeno = ajustarCameraACaixa({ x: 0, y: 0, largura: 100, altura: 100 }, 800, 600);

    expect(pequeno.zoom).toBe(1);
    expect(quadroParaTela([50, 50], pequeno)).toEqual([400, 300]);

    const grande = ajustarCameraACaixa({ x: 0, y: 0, largura: 4000, altura: 1000 }, 800, 600, 0);

    expect(grande.zoom).toBeCloseTo(0.2);
    expect(ajustarCameraACaixa(null, 800, 600)).toEqual({ x: 0, y: 0, zoom: 1 });
  });
});
