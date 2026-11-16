import { describe, expect, it } from 'vitest';

import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import {
  criarForma,
  criarLinha,
  moverElementos,
  proximoZ,
  removerElementosPorId,
} from 'src/modules/quadros/utils/editar-elementos-quadro.util';

const a: ElementoQuadro = { id: 'a', tipo: 'retangulo', x: 0, y: 0, largura: 100, altura: 50, cor: 'blue', z: 1, texto: '' };
const b: ElementoQuadro = { id: 'b', tipo: 'retangulo', x: 300, y: 0, largura: 100, altura: 50, cor: 'blue', z: 2, texto: '' };
const seta = criarLinha({ id: 's', tipo: 'seta', pontos: [[104, 25], [296, 25]], cor: 'gray', z: 3, deId: 'a', paraId: 'b' });

describe('editar-elementos-quadro', () => {
  it('criar forma arrastando normaliza a direção; clique usa tamanho padrão', () => {
    expect(criarForma({ id: 'x', tipo: 'retangulo', inicio: [50, 60], fim: [10, 20], cor: 'red', z: 1 })).toMatchObject({
      x: 10, y: 20, largura: 40, altura: 40,
    });
    expect(criarForma({ id: 'x', tipo: 'nota', inicio: [5, 5], fim: [6, 6], cor: 'red', z: 1 })).toMatchObject({
      largura: 180, altura: 140,
    });
  });

  it('mover forma arrasta a seta presa a ela', () => {
    const resultado = moverElementos([a, b, seta], new Set(['b']), 0, 100);
    const novaSeta = resultado[2];

    expect(resultado[1]).toMatchObject({ x: 300, y: 100 });
    expect(novaSeta.tipo === 'seta' && novaSeta.pontos[1][1]).toBeGreaterThan(25);
  });

  it('mover sem deslocamento devolve a mesma lista', () => {
    const lista = [a, b];

    expect(moverElementos(lista, new Set(['a']), 0, 0)).toBe(lista);
  });

  it('apagar uma forma solta a seta, sem apagá-la', () => {
    const resultado = removerElementosPorId([a, b, seta], new Set(['b']));

    expect(resultado.map((elemento) => elemento.id)).toEqual(['a', 's']);
    expect(resultado[1]).toMatchObject({ deId: 'a' });
    expect(resultado[1]).not.toHaveProperty('paraId');
  });

  it('próximo z fica acima de todos', () => {
    expect(proximoZ([a, b, seta])).toBe(4);
    expect(proximoZ([])).toBe(1);
  });
});
