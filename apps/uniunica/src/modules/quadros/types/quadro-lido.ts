import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';

export type QuadroLido = {
  id: string;
  nome: string;
  conteudo: ConteudoQuadro;
  updatedAt: string | null;
};
