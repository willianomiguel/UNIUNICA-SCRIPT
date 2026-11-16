import { type WikiTreeNode } from 'src/modules/docs/types/wiki-tree-node';

export type WikiTreeGroup = {
  key: string;
  label: string;
  nodes: WikiTreeNode[];
};
