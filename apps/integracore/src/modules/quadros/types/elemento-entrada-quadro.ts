import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';
import { type TipoElementoQuadro } from 'src/modules/quadros/types/tipo-elemento-quadro';

// Elemento como a IA o descreve (tudo opcional menos o tipo); a mescla completa e normaliza.
export type ElementoEntradaQuadro = {
  id?: string;
  tipo: TipoElementoQuadro;
  x?: number;
  y?: number;
  largura?: number;
  altura?: number;
  cor?: CorQuadro;
  texto?: string;
  pontos?: PontoQuadro[];
  deId?: string;
  paraId?: string;
};
