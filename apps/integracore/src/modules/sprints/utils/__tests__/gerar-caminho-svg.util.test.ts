import { describe, expect, it } from 'vitest';

import { gerarCaminhoSvg } from 'src/modules/sprints/utils/gerar-caminho-svg.util';

describe('gerarCaminhoSvg', () => {
  it('gera linha contínua', () => {
    expect(gerarCaminhoSvg([{ x: 0, y: 10 }, { x: 5, y: 5 }, { x: 10, y: 0 }])).toBe(
      'M0.0 10.0 L5.0 5.0 L10.0 0.0',
    );
  });

  it('quebra a linha em valores nulos', () => {
    expect(
      gerarCaminhoSvg([{ x: 0, y: 1 }, { x: 1, y: null }, { x: 2, y: 3 }, { x: 3, y: 4 }]),
    ).toBe('M0.0 1.0 M2.0 3.0 L3.0 4.0');
  });

  it('vazio sem pontos válidos', () => {
    expect(gerarCaminhoSvg([])).toBe('');
    expect(gerarCaminhoSvg([{ x: 0, y: null }])).toBe('');
  });
});
