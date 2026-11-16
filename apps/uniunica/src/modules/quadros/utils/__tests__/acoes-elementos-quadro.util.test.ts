import { describe, expect, it } from 'vitest';

import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import {
  colarElementos,
  duplicarElementos,
  enviarParaTras,
  envolverEmMoldura,
  MARGEM_MOLDURA,
  trazerParaFrente,
} from 'src/modules/quadros/utils/acoes-elementos-quadro.util';

const forma = (id: string, x: number, z: number): ElementoQuadro => ({
  id, tipo: 'retangulo', x, y: 0, largura: 100, altura: 50, cor: 'blue', z, texto: id,
});
const seta: ElementoQuadro = {
  id: 's', tipo: 'seta', pontos: [[104, 25], [196, 25]], x: 104, y: 25, largura: 92, altura: 0, cor: 'gray', z: 3, deId: 'a', paraId: 'b',
};
const base = [forma('a', 0, 1), forma('b', 200, 2), seta];

const geradorDeIds = () => {
  let contador = 0;

  return () => `novo-${++contador}`;
};

describe('acoes-elementos-quadro', () => {
  it('duplicar copia com ids novos, deslocado, e a seta liga as cópias', () => {
    const { elementos, idsNovos } = duplicarElementos(base, new Set(['a', 'b', 's']), geradorDeIds());

    expect(idsNovos).toHaveLength(3);
    const copiaSeta = elementos.find((elemento) => elemento.tipo === 'seta' && idsNovos.includes(elemento.id));

    expect(copiaSeta).toMatchObject({ deId: expect.stringMatching(/^novo-/), paraId: expect.stringMatching(/^novo-/) });
    expect(elementos.find((elemento) => elemento.id === idsNovos[0])).toMatchObject({ x: 24, y: 24 });
  });

  it('duplicar só a seta mantém ela presa às formas originais', () => {
    const { elementos, idsNovos } = duplicarElementos(base, new Set(['s']), geradorDeIds());

    expect(elementos.find((elemento) => elemento.id === idsNovos[0])).toMatchObject({ deId: 'a', paraId: 'b' });
  });

  it('colar põe o canto da seleção no ponto clicado', () => {
    const { elementos, idsNovos } = colarElementos(base, [forma('a', 0, 1)], geradorDeIds(), [500, 300]);

    expect(elementos.find((elemento) => elemento.id === idsNovos[0])).toMatchObject({ x: 500, y: 300 });
    expect(colarElementos(base, [], geradorDeIds()).idsNovos).toEqual([]);
  });

  it('frente e trás mudam o z', () => {
    expect(trazerParaFrente(base, new Set(['a'])).find((e) => e.id === 'a')?.z).toBe(4);
    expect(enviarParaTras(base, new Set(['b'])).find((e) => e.id === 'b')?.z).toBeLessThan(1);
  });

  it('envolver em moldura cria a moldura em volta com margem', () => {
    const resultado = envolverEmMoldura(base, new Set(['a', 'b']), 'm');
    const moldura = resultado.find((elemento) => elemento.id === 'm');

    expect(moldura).toMatchObject({
      tipo: 'moldura',
      x: -MARGEM_MOLDURA,
      y: -MARGEM_MOLDURA,
      largura: 300 + MARGEM_MOLDURA * 2,
      altura: 50 + MARGEM_MOLDURA * 2,
    });
    expect(envolverEmMoldura(base, new Set(), 'm')).toBe(base);
  });
});
