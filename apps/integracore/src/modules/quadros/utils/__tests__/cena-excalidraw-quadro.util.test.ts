import { describe, expect, it } from 'vitest';

import { type CenaQuadro } from 'src/modules/quadros/types/cena-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type OpcoesCenaQuadro } from 'src/modules/quadros/types/opcoes-cena-quadro';
import { aplicarConteudoNaCena } from 'src/modules/quadros/utils/aplicar-conteudo-na-cena.util';
import { cenaDoConteudoLegado } from 'src/modules/quadros/utils/cena-do-conteudo-legado.util';
import { converterDeExcalidraw } from 'src/modules/quadros/utils/converter-de-excalidraw.util';
import { converterParaExcalidraw } from 'src/modules/quadros/utils/converter-para-excalidraw.util';
import { enderecoEditorQuadro } from 'src/modules/quadros/utils/endereco-editor-quadro.util';
import { mesclarDiagramaQuadro } from 'src/modules/quadros/utils/mesclar-diagrama-quadro.util';
import { normalizarCenaQuadro } from 'src/modules/quadros/utils/normalizar-cena-quadro.util';
import { removerElementosQuadro } from 'src/modules/quadros/utils/remover-elementos-quadro.util';

const opcoes: OpcoesCenaQuadro = { agora: 1_000, aleatorio: () => 0.5 };

const forma = (id: string, tipo: 'retangulo' | 'nota' | 'elipse', texto: string, x = 0): ElementoQuadro => ({
  id,
  tipo,
  x,
  y: 0,
  largura: 160,
  altura: 80,
  cor: 'green',
  z: 0,
  texto,
});

const seta: ElementoQuadro = {
  id: 'ab',
  tipo: 'seta',
  x: 160,
  y: 40,
  largura: 140,
  altura: 0,
  cor: 'gray',
  z: 1,
  pontos: [
    [160, 40],
    [300, 40],
  ],
  deId: 'a',
  paraId: 'b',
  texto: 'sim',
};

const cenaLegada = () =>
  cenaDoConteudoLegado(
    { versao: 1, elementos: [forma('a', 'retangulo', 'Início'), forma('b', 'elipse', 'Fim', 300), seta] },
    opcoes,
  );

describe('converterParaExcalidraw', () => {
  it('cria forma com texto preso, cor da paleta e seta ligada nas duas pontas', () => {
    const { criados, alterados } = converterParaExcalidraw(
      [forma('a', 'retangulo', 'Início'), forma('b', 'elipse', 'Fim', 300), seta],
      [],
      opcoes,
    );
    const porId = new Map(criados.map((elemento) => [elemento.id, elemento]));

    expect(alterados).toEqual([]);
    expect(porId.get('a')).toMatchObject({ type: 'rectangle', backgroundColor: '#b2f2bb', strokeColor: '#2f9e44' });
    expect(porId.get('a-texto')).toMatchObject({ type: 'text', containerId: 'a', originalText: 'Início' });
    expect(porId.get('b')?.type).toBe('ellipse');
    expect(porId.get('ab')).toMatchObject({
      type: 'arrow',
      x: 160,
      y: 40,
      points: [
        [0, 0],
        [140, 0],
      ],
      startBinding: { elementId: 'a' },
      endBinding: { elementId: 'b' },
    });
    expect(porId.get('a')?.boundElements).toEqual([
      { id: 'a-texto', type: 'text' },
      { id: 'ab', type: 'arrow' },
    ]);
    expect(porId.get('ab-texto')).toMatchObject({ containerId: 'ab', originalText: 'sim' });
  });

  it('seta nova presa a forma que já existe atualiza a forma com versão maior', () => {
    const existente = cenaLegada().elements.find((elemento) => elemento.id === 'b');
    const { alterados } = converterParaExcalidraw(
      [{ ...seta, id: 'nova', deId: undefined, texto: undefined }],
      existente ? [existente] : [],
      opcoes,
    );

    expect(alterados).toHaveLength(1);
    expect(alterados[0]).toMatchObject({ id: 'b', version: 2, updated: 1_000 });
    expect(alterados[0]?.boundElements).toContainEqual({ id: 'nova', type: 'arrow' });
  });
});

describe('converterDeExcalidraw', () => {
  it('volta para a visão simplificada com textos, cores e ligações', () => {
    const elementos = converterDeExcalidraw(cenaLegada().elements);

    expect(elementos.map((elemento) => [elemento.id, elemento.tipo])).toEqual([
      ['a', 'retangulo'],
      ['b', 'elipse'],
      ['ab', 'seta'],
    ]);
    expect(elementos[0]).toMatchObject({ texto: 'Início', cor: 'green', largura: 160 });
    expect(elementos[2]).toMatchObject({ deId: 'a', paraId: 'b', texto: 'sim', pontos: [[160, 40], [300, 40]] });
  });

  it('ignora apagados e trata tipos desconhecidos como caixa', () => {
    const elementos = converterDeExcalidraw([
      { id: 'x', type: 'diamond', x: 1, y: 2, width: 3, height: 4 },
      { id: 'y', type: 'rectangle', x: 0, y: 0, width: 1, height: 1, isDeleted: true },
    ]);

    expect(elementos).toEqual([{ id: 'x', tipo: 'retangulo', x: 1, y: 2, largura: 3, altura: 4, cor: 'gray', z: 0, texto: '' }]);
  });
});

describe('normalizarCenaQuadro', () => {
  it('aceita só cena do Excalidraw e descarta elementos quebrados', () => {
    expect(normalizarCenaQuadro(null)).toBeNull();
    expect(normalizarCenaQuadro({ versao: 1, elementos: [] })).toBeNull();
    expect(
      normalizarCenaQuadro({
        tipo: 'excalidraw',
        elements: [{ id: 'a', type: 'text', x: 0, y: 0, width: 1, height: 1 }, { id: 'b' }, 'lixo'],
        files: [],
      }),
    ).toEqual({
      tipo: 'excalidraw',
      versao: 1,
      elements: [{ id: 'a', type: 'text', x: 0, y: 0, width: 1, height: 1 }],
      appState: {},
      files: {},
    });
  });
});

describe('aplicarConteudoNaCena', () => {
  const visao = (cena: CenaQuadro) => ({ versao: 1 as const, elementos: converterDeExcalidraw(cena.elements) });

  it('diagrama novo entra depois do desenho atual sem mexer nele', () => {
    const cena = cenaLegada();
    const antes = visao(cena);
    const mescla = mesclarDiagramaQuadro(antes, { nos: [{ id: 'n1', texto: 'Novo' }], ligacoes: [], substituir: false });

    if (!mescla.ok) {
      throw new Error(mescla.erro);
    }

    const depois = aplicarConteudoNaCena(cena, antes, mescla.conteudo, opcoes);

    expect(depois.elements.slice(0, cena.elements.length)).toEqual(cena.elements);
    expect(depois.elements.length).toBeGreaterThan(cena.elements.length);
    expect(converterDeExcalidraw(depois.elements).some((elemento) => 'texto' in elemento && elemento.texto === 'Novo')).toBe(
      true,
    );
  });

  it('remoção marca como apagado (forma, texto preso e seta ligada) com versão maior', () => {
    const cena = cenaLegada();
    const antes = visao(cena);
    const depois = aplicarConteudoNaCena(cena, antes, removerElementosQuadro(antes, ['a']).conteudo, opcoes);
    const apagados = depois.elements.filter((elemento) => elemento.isDeleted).map((elemento) => elemento.id);

    expect(apagados.sort()).toEqual(['a', 'a-texto', 'ab', 'ab-texto']);
    expect(depois.elements.find((elemento) => elemento.id === 'a')?.version).toBe(2);
    expect(converterDeExcalidraw(depois.elements).map((elemento) => elemento.id)).toEqual(['b']);
  });
});

describe('enderecoEditorQuadro', () => {
  it('põe id, token e tema só no hash (a API é a origem da página)', () => {
    const endereco = enderecoEditorQuadro({
      apiUrl: 'http://localhost:3000/',
      quadroId: 'q1',
      token: 'a b+c',
      tema: 'dark',
    });
    const url = new URL(endereco);

    expect(`${url.origin}${url.pathname}`).toBe('http://localhost:3000/quadro-excalidraw/editor.htm');
    expect(url.search).toBe('');
    expect(Object.fromEntries(new URLSearchParams(url.hash.slice(1)))).toEqual({
      id: 'q1',
      t: 'a b+c',
      tema: 'dark',
    });
  });
});
