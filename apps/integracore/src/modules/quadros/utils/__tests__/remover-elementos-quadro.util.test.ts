import { describe, expect, it } from 'vitest';

import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { removerElementosQuadro } from 'src/modules/quadros/utils/remover-elementos-quadro.util';

const forma = (id: string): ElementoQuadro =>
  ({ id, tipo: 'retangulo', x: 0, y: 0, largura: 10, altura: 10, cor: 'blue', z: 0, texto: id });
const seta = (id: string, deId?: string, paraId?: string): ElementoQuadro =>
  ({
    id,
    tipo: 'seta',
    x: 0,
    y: 0,
    largura: 1,
    altura: 1,
    cor: 'gray',
    z: 1,
    pontos: [[0, 0], [1, 1]],
    ...(deId ? { deId } : {}),
    ...(paraId ? { paraId } : {}),
  });

const conteudo: ConteudoQuadro = {
  versao: 1,
  camera: { x: 0, y: 0, zoom: 1 },
  elementos: [forma('a'), forma('b'), forma('c'), seta('ab', 'a', 'b'), seta('bc', 'b', 'c'), seta('solta')],
};

describe('removerElementosQuadro', () => {
  it('remove a forma e as setas presas a ela, relatando-as', () => {
    const r = removerElementosQuadro(conteudo, ['a']);

    expect(r.removidos).toEqual(['a']);
    expect(r.setasRemovidasPorLigacao).toEqual(['ab']);
    expect(r.conteudo.elementos.map((e) => e.id)).toEqual(['b', 'c', 'bc', 'solta']);
    expect(r.conteudo.camera).toEqual({ x: 0, y: 0, zoom: 1 });
  });

  it('relata ids desconhecidos e não mexe no resto', () => {
    const r = removerElementosQuadro(conteudo, ['zzz', 'solta']);

    expect(r.naoEncontrados).toEqual(['zzz']);
    expect(r.removidos).toEqual(['solta']);
    expect(r.conteudo.elementos).toHaveLength(5);
  });

  it('não conta seta removida explicitamente como removida por ligação', () => {
    const r = removerElementosQuadro(conteudo, ['b', 'ab']);

    expect(r.setasRemovidasPorLigacao).toEqual(['bc']);
    expect(r.removidos).toEqual(['b', 'ab']);
  });

  it('não altera o conteúdo original', () => {
    removerElementosQuadro(conteudo, ['a']);

    expect(conteudo.elementos).toHaveLength(6);
  });
});
