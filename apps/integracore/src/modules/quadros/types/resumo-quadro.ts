import { type CaixaQuadro } from 'src/modules/quadros/types/caixa-quadro';
import { type TipoElementoQuadro } from 'src/modules/quadros/types/tipo-elemento-quadro';

export type ResumoElementoQuadro = {
  id: string;
  tipo: TipoElementoQuadro;
  texto?: string;
  cor: string;
  x: number;
  y: number;
  largura: number;
  altura: number;
  // Só nas setas: ids e textos das formas ligadas.
  de?: { id: string; texto: string };
  para?: { id: string; texto: string };
};

export type ResumoQuadro = {
  total: number;
  porTipo: Partial<Record<TipoElementoQuadro, number>>;
  caixa: CaixaQuadro | null;
  elementos: ResumoElementoQuadro[];
  // Uma linha por ligação: "A → B (texto)".
  ligacoes: string[];
  texto: string;
};
