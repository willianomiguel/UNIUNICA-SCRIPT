import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { type CaixaQuadro } from 'src/modules/quadros/types/caixa-quadro';
import { type CameraQuadro } from 'src/modules/quadros/types/camera-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';

export const CAMERA_INICIAL: CameraQuadro = { x: 0, y: 0, zoom: 1 };

export const limitarZoom = (zoom: number): number =>
  Math.min(Math.max(zoom, LIMITES_QUADRO.zoomMinimo), LIMITES_QUADRO.zoomMaximo);

// Coordenada do navegador (clientX/Y) → pixels a partir do canto da área de desenho.
// clientX e getBoundingClientRect vêm em pixels de tela; com o zoom da página (--t-zoom do tema, 1.2)
// o CSS do quadro roda em pixels menores, então divide pela escala (largura na tela ÷ largura no CSS).
export const clienteParaTela = (cliente: PontoQuadro, origemArea: PontoQuadro, escala = 1): PontoQuadro => [
  (cliente[0] - origemArea[0]) / escala,
  (cliente[1] - origemArea[1]) / escala,
];

// Escala entre pixels de tela e pixels do CSS da área; 1 quando a medida não serve.
export const escalaDaArea = (larguraNaTela: number, larguraNoCss: number): number => {
  if (!(larguraNaTela > 0) || !(larguraNoCss > 0)) {
    return 1;
  }
  const escala = larguraNaTela / larguraNoCss;

  // Ignora diferença de arredondamento (meio pixel) para não deslocar o desenho à toa.
  return Math.abs(escala - 1) < 0.01 ? 1 : escala;
};

// Ponto na tela (pixels a partir do canto do SVG) → ponto no quadro.
export const telaParaQuadro = (ponto: PontoQuadro, camera: CameraQuadro): PontoQuadro => [
  camera.x + ponto[0] / camera.zoom,
  camera.y + ponto[1] / camera.zoom,
];

export const quadroParaTela = (ponto: PontoQuadro, camera: CameraQuadro): PontoQuadro => [
  (ponto[0] - camera.x) * camera.zoom,
  (ponto[1] - camera.y) * camera.zoom,
];

// Muda o zoom mantendo parado o ponto do quadro que está sob `pontoTela` (zoom no cursor).
export const zoomNoPonto = (
  camera: CameraQuadro,
  pontoTela: PontoQuadro,
  novoZoom: number,
): CameraQuadro => {
  const zoom = limitarZoom(novoZoom);
  const [qx, qy] = telaParaQuadro(pontoTela, camera);

  return { x: qx - pontoTela[0] / zoom, y: qy - pontoTela[1] / zoom, zoom };
};

export const moverCamera = (camera: CameraQuadro, dxTela: number, dyTela: number): CameraQuadro => ({
  ...camera,
  x: camera.x - dxTela / camera.zoom,
  y: camera.y - dyTela / camera.zoom,
});

// Enquadra a caixa na tela com margem; nunca passa de 100% para não ampliar quadros pequenos.
export const ajustarCameraACaixa = (
  caixa: CaixaQuadro | null,
  larguraTela: number,
  alturaTela: number,
  margem = 48,
): CameraQuadro => {
  if (caixa === null || larguraTela <= 0 || alturaTela <= 0) {
    return CAMERA_INICIAL;
  }

  const larguraUtil = Math.max(larguraTela - margem * 2, 1);
  const alturaUtil = Math.max(alturaTela - margem * 2, 1);
  const zoom = limitarZoom(
    Math.min(1, larguraUtil / Math.max(caixa.largura, 1), alturaUtil / Math.max(caixa.altura, 1)),
  );

  return {
    zoom,
    x: caixa.x + caixa.largura / 2 - larguraTela / 2 / zoom,
    y: caixa.y + caixa.altura / 2 - alturaTela / 2 / zoom,
  };
};
