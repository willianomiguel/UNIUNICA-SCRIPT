import { type CenaQuadro } from 'src/modules/quadros/types/cena-quadro';
import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';

// `cena` é o que está gravado; `conteudo` é a visão simplificada dela que as ferramentas da IA usam.
export type QuadroLido = {
  id: string;
  nome: string;
  cena: CenaQuadro;
  conteudo: ConteudoQuadro;
  updatedAt: string | null;
};
