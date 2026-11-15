import { type WikiTreeNode } from 'src/modules/docs/types/wiki-tree-node';
import { normalizeSearchText } from 'src/modules/docs/utils/normalize-search-text.util';

// Mantém nós cujo título casa com a busca (sem acento/caixa) e os ancestrais deles.
export const filterWikiTree = (
  nodes: WikiTreeNode[],
  query: string,
): WikiTreeNode[] => {
  const normalizedQuery = normalizeSearchText(query);

  if (normalizedQuery === '') {
    return nodes;
  }

  const terms = normalizedQuery.split(/\s+/);

  const filterNode = (node: WikiTreeNode): WikiTreeNode | null => {
    const title = normalizeSearchText(node.document.titulo);
    const matches = terms.every((term) => title.includes(term));
    const children = node.children
      .map(filterNode)
      .filter((child): child is WikiTreeNode => child !== null);

    if (matches || children.length > 0) {
      return { document: node.document, children };
    }

    return null;
  };

  return nodes
    .map(filterNode)
    .filter((node): node is WikiTreeNode => node !== null);
};
