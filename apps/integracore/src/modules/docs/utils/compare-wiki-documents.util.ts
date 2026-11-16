import { type WikiDocument } from 'src/modules/docs/types/wiki-document';

// Fixados primeiro, depois `ordem` crescente, depois título (pt-BR).
export const compareWikiDocuments = (
  left: WikiDocument,
  right: WikiDocument,
): number => {
  if (left.fixado !== right.fixado) {
    return left.fixado ? -1 : 1;
  }

  if (left.ordem !== right.ordem) {
    return left.ordem - right.ordem;
  }

  return left.titulo.localeCompare(right.titulo, 'pt-BR', {
    sensitivity: 'base',
  });
};
