import { type CameraQuadro } from 'src/modules/quadros/types/camera-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';

export type ConteudoQuadro = {
  versao: 1;
  elementos: ElementoQuadro[];
  camera?: CameraQuadro;
};
