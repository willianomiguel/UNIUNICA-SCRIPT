import { describe, expect, it } from 'vitest';

import { buildWikiTree } from 'src/modules/docs/utils/build-wiki-tree.util';
import { filterWikiTree } from 'src/modules/docs/utils/filter-wiki-tree.util';
import { buildWikiDocument } from 'src/modules/docs/utils/__tests__/wiki-document.fixture';

const tree = buildWikiTree([
  buildWikiDocument({ id: 'proc', titulo: 'Processos' }),
  buildWikiDocument({ id: 'deploy', titulo: 'Processo de deploy', documentoPaiId: 'proc' }),
  buildWikiDocument({ id: 'ata', titulo: 'Ata de reunião (modelo)' }),
]);

describe('filterWikiTree', () => {
  it('retorna a árvore inteira com busca vazia', () => {
    expect(filterWikiTree(tree, '  ')).toBe(tree);
  });

  it('mantém ancestrais de um filho que casa', () => {
    const result = filterWikiTree(tree, 'deploy');

    expect(result.map((node) => node.document.id)).toEqual(['proc']);
    expect(result[0].children.map((node) => node.document.id)).toEqual(['deploy']);
  });

  it('ignora acentos e exige todos os termos', () => {
    expect(filterWikiTree(tree, 'REUNIAO modelo').map((n) => n.document.id)).toEqual(['ata']);
    expect(filterWikiTree(tree, 'reuniao deploy')).toEqual([]);
  });
});
