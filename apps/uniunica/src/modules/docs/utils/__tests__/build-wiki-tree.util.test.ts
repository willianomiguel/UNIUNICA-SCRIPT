import { describe, expect, it } from 'vitest';

import { type WikiTreeNode } from 'src/modules/docs/types/wiki-tree-node';
import { buildWikiTree } from 'src/modules/docs/utils/build-wiki-tree.util';
import { buildWikiDocument } from 'src/modules/docs/utils/__tests__/wiki-document.fixture';

const shape = (nodes: WikiTreeNode[]): unknown =>
  nodes.map((node) => ({ id: node.document.id, children: shape(node.children) }));

describe('buildWikiTree', () => {
  it('aninha filhos pelo documentoPai e ordena irmãos', () => {
    const tree = buildWikiTree([
      buildWikiDocument({ id: 'filho-2', documentoPaiId: 'raiz', ordem: 2 }),
      buildWikiDocument({ id: 'raiz' }),
      buildWikiDocument({ id: 'filho-1', documentoPaiId: 'raiz', ordem: 1 }),
      buildWikiDocument({ id: 'neto', documentoPaiId: 'filho-1' }),
    ]);

    expect(shape(tree)).toEqual([
      {
        id: 'raiz',
        children: [
          { id: 'filho-1', children: [{ id: 'neto', children: [] }] },
          { id: 'filho-2', children: [] },
        ],
      },
    ]);
  });

  it('promove a raiz documentos com pai inexistente', () => {
    const tree = buildWikiTree([
      buildWikiDocument({ id: 'orfao', documentoPaiId: 'sumiu' }),
    ]);

    expect(shape(tree)).toEqual([{ id: 'orfao', children: [] }]);
  });

  it('quebra ciclos promovendo os documentos a raiz', () => {
    const tree = buildWikiTree([
      buildWikiDocument({ id: 'a', documentoPaiId: 'b' }),
      buildWikiDocument({ id: 'b', documentoPaiId: 'a' }),
    ]);

    expect(tree.map((node) => node.document.id).sort()).toEqual(['a', 'b']);
  });

  it('retorna lista vazia sem documentos', () => {
    expect(buildWikiTree([])).toEqual([]);
  });
});
