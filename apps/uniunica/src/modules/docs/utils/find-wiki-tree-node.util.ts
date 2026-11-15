import { type WikiTreeNode } from 'src/modules/docs/types/wiki-tree-node';

export const findWikiTreeNode = (
  nodes: WikiTreeNode[],
  documentId: string,
): WikiTreeNode | null => {
  for (const node of nodes) {
    if (node.document.id === documentId) {
      return node;
    }

    const found = findWikiTreeNode(node.children, documentId);

    if (found !== null) {
      return found;
    }
  }

  return null;
};
