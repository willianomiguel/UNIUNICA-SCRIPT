import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';

type Base = {
  id: string;
  x: number;
  y: number;
  largura: number;
  altura: number;
  cor: CorQuadro;
  z: number;
};

// Formas com texto (na moldura, o texto é o título). Seta e traço guardam os pontos em coordenadas absolutas do quadro;
// x/y/largura/altura deles são a caixa que envolve os pontos.
export type ElementoQuadro =
  | (Base & { tipo: 'retangulo' | 'elipse' | 'nota' | 'texto' | 'moldura'; texto: string })
  | (Base & {
      tipo: 'seta';
      pontos: PontoQuadro[];
      deId?: string;
      paraId?: string;
      texto?: string;
    })
  | (Base & { tipo: 'traco'; pontos: PontoQuadro[] });
