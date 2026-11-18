import { describe, expect, it } from 'vitest';

import { extrairQuadroResposta } from 'src/modules/quadros/utils/extrair-quadro-resposta.util';

describe('extrairQuadroResposta', () => {
  it('lê { data: { quadro } } e normaliza o conteúdo', () => {
    const r = extrairQuadroResposta({
      data: { quadro: { id: 'q1', nome: 'Meu', updatedAt: '2026-01-01', conteudo: 'lixo' } },
    });

    expect(r).toEqual({
      id: 'q1',
      nome: 'Meu',
      updatedAt: '2026-01-01',
      cena: { tipo: 'excalidraw', versao: 1, elements: [], appState: {}, files: {} },
      conteudo: { versao: 1, elementos: [] },
    });
  });

  it('prefere a cena do Excalidraw ao conteúdo antigo', () => {
    const r = extrairQuadroResposta({
      data: {
        quadro: {
          id: 'q3',
          conteudo: { versao: 1, elementos: [{ id: 'velho', tipo: 'texto', x: 0, y: 0, largura: 10, altura: 10, cor: 'gray', z: 0, texto: 'x' }] },
          cena: { tipo: 'excalidraw', elements: [{ id: 'novo', type: 'text', x: 0, y: 0, width: 1, height: 1, text: 'oi' }] },
        },
      },
    });

    expect(r?.conteudo.elementos.map((elemento) => elemento.id)).toEqual(['novo']);
  });

  it('aceita registro direto em data e rejeita formatos sem id', () => {
    expect(extrairQuadroResposta({ data: { id: 'q2', conteudo: null } })?.id).toBe('q2');
    expect(extrairQuadroResposta({ data: {} })).toBeNull();
    expect(extrairQuadroResposta(null)).toBeNull();
  });
});
