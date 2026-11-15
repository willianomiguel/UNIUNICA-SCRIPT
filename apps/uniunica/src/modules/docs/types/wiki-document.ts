export type WikiDocument = {
  id: string;
  titulo: string;
  categoria: string;
  status: string;
  fixado: boolean;
  ordem: number;
  documentoPaiId: string | null;
  conteudoMarkdown: string;
  updatedAt: string | null;
};
