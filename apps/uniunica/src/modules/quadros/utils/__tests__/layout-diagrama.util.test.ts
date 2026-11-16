import { describe, expect, it } from 'vitest';

import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { layoutDiagramaQuadro, quebrarTextoQuadro, tamanhoDoTextoQuadro } from 'src/modules/quadros/utils/layout-diagrama.util';

const formas = (elementos: ElementoQuadro[]) => elementos.filter((e) => e.tipo !== 'seta');

const sobrepoe = (a: ElementoQuadro, b: ElementoQuadro): boolean =>
  a.x < b.x + b.largura && b.x < a.x + a.largura && a.y < b.y + b.altura && b.y < a.y + a.altura;

const semSobreposicao = (elementos: ElementoQuadro[]): boolean => {
  const lista = formas(elementos);

  return lista.every((a, i) => lista.slice(i + 1).every((b) => !sobrepoe(a, b)));
};

describe('quebrarTextoQuadro / tamanhoDoTextoQuadro', () => {
  it('quebra por palavras em ~24 colunas e parte palavras gigantes', () => {
    expect(quebrarTextoQuadro('um dois tres quatro cinco seis sete oito').every((l) => l.length <= 24)).toBe(true);
    expect(quebrarTextoQuadro('x'.repeat(60)).map((l) => l.length)).toEqual([24, 24, 12]);
  });

  it('respeita o tamanho mínimo e cresce com o texto', () => {
    expect(tamanhoDoTextoQuadro('Oi')).toEqual({ largura: 160, altura: 64 });
    expect(tamanhoDoTextoQuadro('palavra '.repeat(20)).altura).toBeGreaterThan(64);
  });
});

describe('layoutDiagramaQuadro', () => {
  it('põe a cadeia A -> B -> C em camadas crescentes para a direita', () => {
    const r = layoutDiagramaQuadro({
      nos: [
        { id: 'a', texto: 'A' },
        { id: 'b', texto: 'B' },
        { id: 'c', texto: 'C' },
      ],
      ligacoes: [
        { de: 'a', para: 'b' },
        { de: 'b', para: 'c', texto: 'ok' },
      ],
    });
    const [a, b, c] = ['a', 'b', 'c'].map((id) => r.elementos.find((e) => e.id === r.mapaIds[id])) as ElementoQuadro[];

    expect(a.x).toBeLessThan(b.x);
    expect(b.x).toBeLessThan(c.x);
    expect(b.x - (a.x + a.largura)).toBe(80);
    expect(r.elementos.filter((e) => e.tipo === 'seta')).toHaveLength(2);
  });

  it('usa direção "baixo"', () => {
    const r = layoutDiagramaQuadro({
      nos: [
        { id: 'a', texto: 'A' },
        { id: 'b', texto: 'B' },
      ],
      ligacoes: [{ de: 'a', para: 'b' }],
      direcao: 'baixo',
    });
    const a = r.elementos.find((e) => e.id === r.mapaIds.a) as ElementoQuadro;
    const b = r.elementos.find((e) => e.id === r.mapaIds.b) as ElementoQuadro;

    expect(b.y).toBeGreaterThan(a.y + a.altura);
    expect(a.x).toBe(b.x);
  });

  it('não sobrepõe formas num grafo com ramificação e mantém ids em UUID', () => {
    const r = layoutDiagramaQuadro({
      nos: ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, texto: `Passo ${id} com um texto razoavelmente longo` })),
      ligacoes: [
        { de: 'a', para: 'b' },
        { de: 'a', para: 'c' },
        { de: 'a', para: 'd' },
        { de: 'b', para: 'e' },
        { de: 'c', para: 'e' },
      ],
    });

    expect(semSobreposicao(r.elementos)).toBe(true);
    expect(Object.values(r.mapaIds)[0]).toMatch(/^[0-9a-f-]{36}$/);
    expect(new Set(r.elementos.map((e) => e.id)).size).toBe(r.elementos.length);
  });

  it('tolera ciclos e nós soltos', () => {
    const r = layoutDiagramaQuadro({
      nos: [
        { id: 'a', texto: 'A' },
        { id: 'b', texto: 'B' },
        { id: 'solto', texto: 'Solto' },
      ],
      ligacoes: [
        { de: 'a', para: 'b' },
        { de: 'b', para: 'a' },
      ],
    });

    expect(formas(r.elementos)).toHaveLength(3);
    expect(semSobreposicao(r.elementos)).toBe(true);
    expect(r.elementos.every((e) => Number.isFinite(e.x) && Number.isFinite(e.y))).toBe(true);
  });

  it('prende as setas (deId/paraId), com ponta fora do centro, e leva o rótulo', () => {
    const r = layoutDiagramaQuadro({
      nos: [
        { id: 'a', texto: 'A', forma: 'elipse', cor: 'green' },
        { id: 'b', texto: 'B' },
      ],
      ligacoes: [{ de: 'a', para: 'b', texto: 'sim' }],
    });
    const seta = r.elementos.find((e) => e.tipo === 'seta');
    const a = r.elementos.find((e) => e.id === r.mapaIds.a) as ElementoQuadro;

    expect(seta).toMatchObject({ deId: r.mapaIds.a, paraId: r.mapaIds.b, texto: 'sim' });
    expect(a).toMatchObject({ tipo: 'elipse', cor: 'green' });
    if (seta?.tipo === 'seta') {
      expect(seta.pontos[0][0]).toBeGreaterThan(a.x + a.largura / 2);
      expect(seta.largura).toBeGreaterThan(0);
    }
  });

  it('aplica origem e z inicial', () => {
    const r = layoutDiagramaQuadro({ nos: [{ id: 'a', texto: 'A' }], ligacoes: [] }, { origem: [500, 300], zInicial: 10 });

    expect(r.elementos[0]).toMatchObject({ x: 500, y: 300, z: 10 });
    expect(r.caixa).toMatchObject({ x: 500, y: 300 });
  });
});
