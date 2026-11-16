import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';

export type HistoricoQuadro = {
  passado: ElementoQuadro[][];
  presente: ElementoQuadro[];
  futuro: ElementoQuadro[][];
};
