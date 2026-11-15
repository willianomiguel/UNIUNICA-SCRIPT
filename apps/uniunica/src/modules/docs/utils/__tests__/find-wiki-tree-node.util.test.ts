import { describe, expect, it } from 'vitest';

import { buildWikiTree } from 'src/modules/docs/utils/build-wiki-tree.util';
import { findWikiTreeNode } from 'src/modules/docs/utils/find-wiki-tree-node.util';
import { buildWikiDocument } from 'src/modules/docs/utils/__tests__/wiki-document.fixture';

describe('findWikiTreeNode', () => {
  const tree = buildWikiTree([
    buildWikiDocument({ id: 'a' }),
    buildWikiDocument({ id: 'b', documentoPaiId: 'a' }),
  ]);

  it('encontra nós em qualquer profundidade', () => {
    expect(findWikiTreeNode(tree, 'a')?.children).toHaveLength(1);
    expect(findWikiTreeNode(tree, 'b')?.document.id).toBe('b');
  });

  it('retorna null quando não existe', () => {
    expect(findWikiTreeNode(tree, 'z')).toBeNull();
  });
});
