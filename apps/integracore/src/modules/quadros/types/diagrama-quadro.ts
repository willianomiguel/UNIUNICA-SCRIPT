import { type DirecaoDiagramaQuadro } from 'src/modules/quadros/types/direcao-diagrama-quadro';
import { type LigacaoDiagramaQuadro } from 'src/modules/quadros/types/ligacao-diagrama-quadro';
import { type NoDiagramaQuadro } from 'src/modules/quadros/types/no-diagrama-quadro';

export type DiagramaQuadro = {
  nos: NoDiagramaQuadro[];
  ligacoes: LigacaoDiagramaQuadro[];
  direcao?: DirecaoDiagramaQuadro;
};
