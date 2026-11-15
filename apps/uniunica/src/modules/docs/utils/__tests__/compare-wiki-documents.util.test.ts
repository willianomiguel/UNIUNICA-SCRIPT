import { describe, expect, it } from 'vitest';

import { compareWikiDocuments } from 'src/modules/docs/utils/compare-wiki-documents.util';
import { buildWikiDocument } from 'src/modules/docs/utils/__tests__/wiki-document.fixture';

describe('compareWikiDocuments', () => {
  it('ordena fixados, depois ordem, depois título', () => {
    const documents = [
      buildWikiDocument({ id: 'c', titulo: 'Zeta', ordem: 1 }),
      buildWikiDocument({ id: 'b', titulo: 'Alfa', ordem: 1 }),
      buildWikiDocument({ id: 'a', titulo: 'Qualquer', ordem: 5, fixado: true }),
      buildWikiDocument({ id: 'd', titulo: 'Beta', ordem: 0 }),
    ];

    expect([...documents].sort(compareWikiDocuments).map((d) => d.id)).toEqual([
      'a',
      'd',
      'b',
      'c',
    ]);
  });

  it('compara títulos ignorando acentos', () => {
    const left = buildWikiDocument({ id: '1', titulo: 'Ética' });
    const right = buildWikiDocument({ id: '2', titulo: 'etica' });

    expect(compareWikiDocuments(left, right)).toBe(0);
  });
});
