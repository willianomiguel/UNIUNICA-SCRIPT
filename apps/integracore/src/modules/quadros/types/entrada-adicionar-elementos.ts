import { type ElementoEntradaQuadro } from 'src/modules/quadros/types/elemento-entrada-quadro';

export type EntradaAdicionarElementos = {
  quadroId: string;
  elementos: ElementoEntradaQuadro[];
};
