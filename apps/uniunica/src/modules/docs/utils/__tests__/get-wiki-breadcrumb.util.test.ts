import { describe, expect, it } from 'vitest';

import { getWikiBreadcrumb } from 'src/modules/docs/utils/get-wiki-breadcrumb.util';
import { buildWikiDocument } from 'src/modules/docs/utils/__tests__/wiki-document.fixture';

describe('getWikiBreadcrumb', () => {
  it('retorna os ancestrais da raiz até o pai', () => {
    const documents = [
      buildWikiDocument({ id: 'a' }),
      buildWikiDocument({ id: 'b', documentoPaiId: 'a' }),
      buildWikiDocument({ id: 'c', documentoPaiId: 'b' }),
    ];

    expect(getWikiBreadcrumb('c', documents).map((d) => d.id)).toEqual(['a', 'b']);
  });

  it('para em ciclos e em pais inexistentes', () => {
    const documents = [
      buildWikiDocument({ id: 'a', documentoPaiId: 'b' }),
      buildWikiDocument({ id: 'b', documentoPaiId: 'a' }),
      buildWikiDocument({ id: 'x', documentoPaiId: 'sumiu' }),
    ];

    expect(getWikiBreadcrumb('a', documents).map((d) => d.id)).toEqual(['b']);
    expect(getWikiBreadcrumb('x', documents)).toEqual([]);
    expect(getWikiBreadcrumb('nao-existe', documents)).toEqual([]);
  });
});
