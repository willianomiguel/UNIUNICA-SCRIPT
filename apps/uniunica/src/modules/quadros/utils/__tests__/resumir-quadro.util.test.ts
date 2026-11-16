import { describe, expect, it } from 'vitest';

import { resumirQuadro } from 'src/modules/quadros/utils/resumir-quadro.util';

describe('resumirQuadro', () => {
  it('descreve quadro vazio', () => {
    expect(resumirQuadro({ versao: 1, elementos: [] })).toMatchObject({ total: 0, caixa: null, texto: 'Quadro vazio.' });
  });

  it('conta por tipo, mostra caixa e escreve ligações com os textos', () => {
    const r = resumirQuadro({
      versao: 1,
      elementos: [
        { id: 'a', tipo: 'retangulo', x: 0, y: 0, largura: 100, altura: 50, cor: 'blue', z: 0, texto: 'Início' },
        { id: 'b', tipo: 'elipse', x: 300, y: 0, largura: 100, altura: 50, cor: 'green', z: 1, texto: 'Fim' },
        {
          id: 's',
          tipo: 'seta',
          x: 100,
          y: 25,
          largura: 200,
          altura: 0,
          cor: 'gray',
          z: 2,
          pontos: [[100, 25], [300, 25]],
          deId: 'a',
          paraId: 'b',
          texto: 'ok',
        },
        { id: 'x', tipo: 'seta', x: 0, y: 100, largura: 10, altura: 0, cor: 'gray', z: 3, pontos: [[0, 100], [10, 100]] },
      ],
    });

    expect(r.total).toBe(4);
    expect(r.porTipo).toEqual({ retangulo: 1, elipse: 1, seta: 2 });
    expect(r.caixa).toEqual({ x: 0, y: 0, largura: 400, altura: 100 });
    expect(r.ligacoes).toEqual(['Início → Fim (ok)', '(solta) → (solta)']);
    expect(r.elementos[2]).toMatchObject({ de: { id: 'a', texto: 'Início' }, para: { id: 'b', texto: 'Fim' } });
    expect(r.texto).toContain('[a] retangulo "Início"');
    expect(r.texto).toContain('Início → Fim (ok)');
  });

  it('usa o id quando a forma não tem texto', () => {
    const r = resumirQuadro({
      versao: 1,
      elementos: [
        { id: 'a', tipo: 'nota', x: 0, y: 0, largura: 1, altura: 1, cor: 'red', z: 0, texto: '' },
        { id: 's', tipo: 'seta', x: 0, y: 0, largura: 1, altura: 1, cor: 'gray', z: 1, pontos: [[0, 0], [1, 1]], deId: 'a' },
      ],
    });

    expect(r.ligacoes[0]).toBe('(sem texto, id a) → (solta)');
  });
});
