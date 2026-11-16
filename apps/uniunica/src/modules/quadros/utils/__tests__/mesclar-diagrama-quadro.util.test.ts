import { describe, expect, it } from 'vitest';

import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { caixaDosElementos } from 'src/modules/quadros/utils/caixa-dos-elementos.util';
import { MARGEM_ENTRE_DESENHOS, mesclarDiagramaQuadro } from 'src/modules/quadros/utils/mesclar-diagrama-quadro.util';

const existente: ConteudoQuadro = {
  versao: 1,
  camera: { x: 10, y: 10, zoom: 2 },
  elementos: [
    { id: 'velho', tipo: 'retangulo', x: 100, y: 50, largura: 200, altura: 100, cor: 'blue', z: 7, texto: 'Velho' },
  ],
};
const diagrama = {
  nos: [
    { id: 'a', texto: 'A' },
    { id: 'b', texto: 'B' },
  ],
  ligacoes: [{ de: 'a', para: 'b' }],
  substituir: false,
};

describe('mesclarDiagramaQuadro', () => {
  it('coloca o diagrama à direita do desenho existente, acima em z, sem sobrepor', () => {
    const r = mesclarDiagramaQuadro(existente, diagrama);

    expect(r.ok).toBe(true);
    if (!r.ok) {
      return;
    }

    const novos = r.conteudo.elementos.slice(1);
    const caixaNovos = caixaDosElementos(novos);

    expect(r.conteudo.elementos[0].id).toBe('velho');
    expect(caixaNovos?.x).toBe(300 + MARGEM_ENTRE_DESENHOS);
    expect(novos.every((e) => e.z > 7)).toBe(true);
    expect(r.conteudo.camera).toEqual(existente.camera);
    expect(r.criados).toBe(3);
  });

  it('coloca abaixo quando a direção é baixo', () => {
    const r = mesclarDiagramaQuadro(existente, { ...diagrama, direcao: 'baixo' });

    expect(r.ok && caixaDosElementos(r.conteudo.elementos.slice(1))?.y).toBe(150 + MARGEM_ENTRE_DESENHOS);
  });

  it('substituir troca tudo, começa na origem e solta a câmera', () => {
    const r = mesclarDiagramaQuadro(existente, { ...diagrama, substituir: true });

    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.conteudo.elementos.some((e) => e.id === 'velho')).toBe(false);
      expect(r.conteudo.camera).toBeUndefined();
      expect(caixaDosElementos(r.conteudo.elementos)).toMatchObject({ x: expect.any(Number) });
      expect(Math.min(...r.conteudo.elementos.map((e) => e.x))).toBeLessThanOrEqual(0 + 4);
    }
  });

  it('desenha em quadro vazio a partir da origem', () => {
    const r = mesclarDiagramaQuadro({ versao: 1, elementos: [] }, diagrama);

    expect(r.ok && r.conteudo.elementos.filter((e) => e.tipo !== 'seta')[0]).toMatchObject({ x: 0 });
  });
});
