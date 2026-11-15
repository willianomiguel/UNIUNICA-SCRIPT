import { describe, expect, it } from 'vitest';

import { buildWikiTree } from 'src/modules/docs/utils/build-wiki-tree.util';
import { groupWikiTree } from 'src/modules/docs/utils/group-wiki-tree.util';
import { buildWikiDocument } from 'src/modules/docs/utils/__tests__/wiki-document.fixture';

describe('groupWikiTree', () => {
  it('coloca fixados no topo e agrupa o resto por categoria na ordem do contrato', () => {
    const roots = buildWikiTree([
      buildWikiDocument({ id: 'mkt', categoria: 'MARKETING' }),
      buildWikiDocument({ id: 'est', categoria: 'ESTRATEGIA' }),
      buildWikiDocument({ id: 'pin', categoria: 'PROCESSO', fixado: true }),
      buildWikiDocument({ id: 'desconhecida', categoria: 'NOVA' }),
    ]);

    const groups = groupWikiTree(roots);

    expect(groups.map((group) => [group.key, group.nodes.map((n) => n.document.id)])).toEqual([
      ['FIXADOS', ['pin']],
      ['ESTRATEGIA', ['est']],
      ['MARKETING', ['mkt']],
      ['OUTRO', ['desconhecida']],
    ]);
    expect(groups[0].label).toBe('Fixados');
  });

  it('não cria grupos vazios', () => {
    expect(groupWikiTree([])).toEqual([]);
  });
});
