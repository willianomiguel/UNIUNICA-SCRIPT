import { type CaixaQuadro } from 'src/modules/quadros/types/caixa-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';

export type ResultadoLayoutDiagrama = {
  elementos: ElementoQuadro[];
  // id que a IA deu ao nó -> id (UUID) do elemento criado no quadro.
  mapaIds: Record<string, string>;
  caixa: CaixaQuadro;
};
