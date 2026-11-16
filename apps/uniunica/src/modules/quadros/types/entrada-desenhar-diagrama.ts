import { type DiagramaQuadro } from 'src/modules/quadros/types/diagrama-quadro';

export type EntradaDesenharDiagrama = DiagramaQuadro & {
  quadroId: string;
  substituir: boolean;
};
