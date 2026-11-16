import { type WikiDocument } from 'src/modules/docs/types/wiki-document';
import { type WikiTreeNode } from 'src/modules/docs/types/wiki-tree-node';
import { compareWikiDocuments } from 'src/modules/docs/utils/compare-wiki-documents.util';

// Monta a árvore por documentoPai. Pai inexistente ou ciclo => o documento vira raiz.
export const buildWikiTree = (documents: WikiDocument[]): WikiTreeNode[] => {
  const byId = new Map(documents.map((document) => [document.id, document]));

  const hasValidAncestry = (document: WikiDocument): boolean => {
    const visited = new Set<string>([document.id]);
    let parentId = document.documentoPaiId;

    while (parentId !== null) {
      if (visited.has(parentId)) {
        return false;
      }

      const parent = byId.get(parentId);

      if (parent === undefined) {
        return false;
      }

      visited.add(parentId);
      parentId = parent.documentoPaiId;
    }

    return true;
  };

  const childrenByParentId = new Map<string, WikiDocument[]>();
  const roots: WikiDocument[] = [];

  for (const document of documents) {
    if (document.documentoPaiId !== null && hasValidAncestry(document)) {
      const siblings = childrenByParentId.get(document.documentoPaiId) ?? [];

      siblings.push(document);
      childrenByParentId.set(document.documentoPaiId, siblings);
    } else {
      roots.push(document);
    }
  }

  const toNode = (document: WikiDocument): WikiTreeNode => ({
    document,
    children: [...(childrenByParentId.get(document.id) ?? [])]
      .sort(compareWikiDocuments)
      .map(toNode),
  });

  return [...roots].sort(compareWikiDocuments).map(toNode);
};
