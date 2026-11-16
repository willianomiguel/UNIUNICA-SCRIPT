import { type WikiDocument } from 'src/modules/docs/types/wiki-document';

export const buildWikiDocument = (
  overrides: Partial<WikiDocument> & { id: string },
): WikiDocument => ({
  titulo: overrides.id,
  categoria: 'OUTRO',
  status: 'PUBLICADO',
  fixado: false,
  ordem: 0,
  documentoPaiId: null,
  conteudoMarkdown: '',
  updatedAt: null,
  ...overrides,
});
