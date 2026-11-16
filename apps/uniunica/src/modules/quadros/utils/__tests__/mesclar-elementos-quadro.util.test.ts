import { describe, expect, it } from 'vitest';

import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { mesclarElementosQuadro } from 'src/modules/quadros/utils/mesclar-elementos-quadro.util';

const atual: ConteudoQuadro = {
  versao: 1,
  elementos: [
    { id: 'f1', tipo: 'retangulo', x: 0, y: 0, largura: 100, altura: 50, cor: 'blue', z: 3, texto: 'F1' },
  ],
};

describe('mesclarElementosQuadro', () => {
  it('gera id, normaliza e põe z acima dos existentes', () => {
    const r = mesclarElementosQuadro(atual, [{ tipo: 'nota', texto: 'Oi', x: 400, y: 0 }]);

    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.idsCriados).toHaveLength(1);
      expect(r.conteudo.elementos[1]).toMatchObject({ tipo: 'nota', z: 4, largura: 160, altura: 80, cor: 'blue' });
    }
  });

  it('formas sem posição vão abaixo do desenho, sem se sobrepor', () => {
    const r = mesclarElementosQuadro(atual, [
      { tipo: 'nota', texto: '1' },
      { tipo: 'nota', texto: '2' },
    ]);

    expect(r.ok).toBe(true);
    if (r.ok) {
      const [, a, b] = r.conteudo.elementos;

      expect(a.y).toBeGreaterThan(50);
      expect(b.y).toBeGreaterThanOrEqual(a.y + a.altura);
    }
  });

  it('resolve deId/paraId para formas existentes e novas e recalcula as pontas', () => {
    const r = mesclarElementosQuadro(atual, [
      { id: 'f2', tipo: 'retangulo', x: 400, y: 0, largura: 100, altura: 50 },
      { tipo: 'seta', deId: 'f1', paraId: 'f2', texto: 'vai' },
    ]);

    expect(r.ok).toBe(true);
    if (r.ok) {
      const seta = r.conteudo.elementos[2];

      expect(seta).toMatchObject({ tipo: 'seta', deId: 'f1', paraId: 'f2', texto: 'vai' });
      if (seta.tipo === 'seta') {
        expect(seta.pontos[0][0]).toBeGreaterThan(50);
        expect(seta.pontos[1][0]).toBeLessThan(450);
      }
    }
  });

  it('erra para referência desconhecida, id repetido ou existente', () => {
    expect(mesclarElementosQuadro(atual, [{ tipo: 'seta', deId: 'f1', paraId: 'nada' }])).toMatchObject({
      ok: false,
      erro: expect.stringContaining('"nada"'),
    });
    expect(mesclarElementosQuadro(atual, [{ id: 'f1', tipo: 'nota' }])).toMatchObject({ ok: false });
  });

  it('aceita seta com pontos e traço', () => {
    const r = mesclarElementosQuadro(atual, [
      { tipo: 'seta', pontos: [[0, 0], [100, 100]] },
      { tipo: 'traco', pontos: [[5, 5], [9, 9], [20, 5]] },
    ]);

    expect(r.ok && r.conteudo.elementos).toHaveLength(3);
  });
});
