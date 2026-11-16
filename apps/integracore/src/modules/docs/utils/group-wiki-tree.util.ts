import { DOCUMENTO_CATEGORIAS } from 'src/modules/docs/constants/documento-categorias';
import { type WikiTreeGroup } from 'src/modules/docs/types/wiki-tree-group';
import { type WikiTreeNode } from 'src/modules/docs/types/wiki-tree-node';

// Grupo "Fixados" no topo (raízes fixadas) e depois um grupo por categoria das raízes.
export const groupWikiTree = (roots: WikiTreeNode[]): WikiTreeGroup[] => {
  const pinned = roots.filter((node) => node.document.fixado);
  const groups: WikiTreeGroup[] = [];

  if (pinned.length > 0) {
    groups.push({ key: 'FIXADOS', label: 'Fixados', nodes: pinned });
  }

  const unpinned = roots.filter((node) => !node.document.fixado);
  const knownValues = new Set(DOCUMENTO_CATEGORIAS.map((categoria) => categoria.value));

  for (const categoria of DOCUMENTO_CATEGORIAS) {
    const nodes = unpinned.filter((node) =>
      categoria.value === 'OUTRO'
        ? node.document.categoria === 'OUTRO' ||
          !knownValues.has(node.document.categoria)
        : node.document.categoria === categoria.value,
    );

    if (nodes.length > 0) {
      groups.push({ key: categoria.value, label: categoria.label, nodes });
    }
  }

  return groups;
};
