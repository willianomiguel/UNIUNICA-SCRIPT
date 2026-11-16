import { describe, expect, it } from 'vitest';

import { parseWikiDocuments } from 'src/modules/docs/utils/parse-wiki-documents.util';

describe('parseWikiDocuments', () => {
  it('lê a resposta REST e normaliza campos', () => {
    const result = parseWikiDocuments({
      data: {
        documentos: [
          {
            id: 'a',
            titulo: ' Guia ',
            categoria: 'MARKETING',
            status: 'PUBLICADO',
            fixado: true,
            ordem: 2,
            documentoPaiId: 'b',
            conteudo: { markdown: '# Oi', blocknote: null },
            updatedAt: '2026-01-01T00:00:00Z',
          },
        ],
      },
    });

    expect(result).toEqual([
      {
        id: 'a',
        titulo: 'Guia',
        categoria: 'MARKETING',
        status: 'PUBLICADO',
        fixado: true,
        ordem: 2,
        documentoPaiId: 'b',
        conteudoMarkdown: '# Oi',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ]);
  });

  it('aplica valores padrão para campos ausentes', () => {
    const [document] = parseWikiDocuments([{ id: 'x', ordem: null, conteudo: null }]);

    expect(document).toMatchObject({
      titulo: 'Sem título',
      categoria: 'OUTRO',
      status: 'RASCUNHO',
      fixado: false,
      ordem: 0,
      documentoPaiId: null,
      conteudoMarkdown: '',
    });
  });

  it('ignora itens sem id e respostas inválidas', () => {
    expect(parseWikiDocuments([{ titulo: 'sem id' }, null])).toEqual([]);
    expect(parseWikiDocuments(undefined)).toEqual([]);
    expect(parseWikiDocuments({ data: {} })).toEqual([]);
  });
});
