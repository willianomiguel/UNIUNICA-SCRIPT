import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';

export type ResultadoRemocaoQuadro = {
  conteudo: ConteudoQuadro;
  removidos: string[];
  // Setas apagadas junto porque estavam presas a uma forma removida.
  setasRemovidasPorLigacao: string[];
  naoEncontrados: string[];
};
