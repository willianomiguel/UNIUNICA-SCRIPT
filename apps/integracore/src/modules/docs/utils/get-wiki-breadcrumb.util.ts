import { type WikiDocument } from 'src/modules/docs/types/wiki-document';

// Ancestrais do documento, da raiz até o pai imediato (seguro contra ciclos).
export const getWikiBreadcrumb = (
  documentId: string,
  documents: WikiDocument[],
): WikiDocument[] => {
  const byId = new Map(documents.map((document) => [document.id, document]));
  const ancestors: WikiDocument[] = [];
  const visited = new Set<string>([documentId]);
  let parentId = byId.get(documentId)?.documentoPaiId ?? null;

  while (parentId !== null && !visited.has(parentId)) {
    const parent = byId.get(parentId);

    if (parent === undefined) {
      break;
    }

    visited.add(parentId);
    ancestors.unshift(parent);
    parentId = parent.documentoPaiId;
  }

  return ancestors;
};
