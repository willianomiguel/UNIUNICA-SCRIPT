import { describe, expect, it } from 'vitest';

import { normalizarConteudoQuadro } from 'src/modules/quadros/utils/normalizar-conteudo-quadro.util';

describe('normalizarConteudoQuadro', () => {
  it('devolve quadro vazio para null, lixo e JSON quebrado', () => {
    for (const bruto of [null, undefined, 42, 'não é json', '[1,2]', { elementos: 'x' }]) {
      expect(normalizarConteudoQuadro(bruto)).toEqual({ versao: 1, elementos: [] });
    }
  });

  it('aceita string JSON e mantém elementos válidos', () => {
    const conteudo = normalizarConteudoQuadro(
      JSON.stringify({ versao: 1, elementos: [{ id: 'a', tipo: 'retangulo', x: 10, y: 20, largura: 100, altura: 50, cor: 'green', z: 1, texto: 'Oi' }] }),
    );

    expect(conteudo.elementos).toEqual([
      { id: 'a', tipo: 'retangulo', x: 10, y: 20, largura: 100, altura: 50, cor: 'green', z: 1, texto: 'Oi' },
    ]);
  });

  it('troca cor desconhecida pela padrão, descarta tipo desconhecido e seta sem pontos', () => {
    const conteudo = normalizarConteudoQuadro({
      elementos: [
        { id: 'a', tipo: 'nota', cor: 'neon' },
        { id: 'b', tipo: 'hexagono' },
        { id: 'c', tipo: 'seta', pontos: [[0, 0]] },
      ],
    });

    expect(conteudo.elementos).toHaveLength(1);
    expect(conteudo.elementos[0]).toMatchObject({ id: 'a', tipo: 'nota', cor: 'blue', texto: '' });
  });

  it('recalcula a caixa de setas/traços pelos pontos e solta ligações para ids inexistentes', () => {
    const conteudo = normalizarConteudoQuadro({
      elementos: [
        { id: 'a', tipo: 'retangulo' },
        { id: 's', tipo: 'seta', pontos: [[10, 50], [110, 0]], deId: 'a', paraId: 'sumiu' },
      ],
    });
    const seta = conteudo.elementos[1];

    expect(seta).toMatchObject({ x: 10, y: 0, largura: 100, altura: 50, deId: 'a' });
    expect(seta).not.toHaveProperty('paraId');
  });

  it('desduplica ids e corta texto longo', () => {
    const conteudo = normalizarConteudoQuadro({
      elementos: [
        { id: 'x', tipo: 'texto', texto: 'a'.repeat(900) },
        { id: 'x', tipo: 'texto' },
      ],
    });

    expect(new Set(conteudo.elementos.map((elemento) => elemento.id)).size).toBe(2);
    expect((conteudo.elementos[0] as { texto: string }).texto).toHaveLength(500);
  });

  it('limita o zoom da câmera e ignora números inválidos', () => {
    expect(normalizarConteudoQuadro({ elementos: [], camera: { x: 'a', y: 5, zoom: 99 } }).camera).toEqual({
      x: 0,
      y: 5,
      zoom: 4,
    });
  });
});
