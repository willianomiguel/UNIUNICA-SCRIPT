import { type WikiDocument } from 'src/modules/docs/types/wiki-document';

export type WikiTreeNode = {
  document: WikiDocument;
  children: WikiTreeNode[];
};
