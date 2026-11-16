import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';
import { type FormaDiagramaQuadro } from 'src/modules/quadros/types/forma-diagrama-quadro';

export type NoDiagramaQuadro = {
  id: string;
  texto: string;
  forma?: FormaDiagramaQuadro;
  cor?: CorQuadro;
};
