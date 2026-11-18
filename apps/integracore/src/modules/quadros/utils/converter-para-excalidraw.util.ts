import { CORES_EXCALIDRAW } from 'src/modules/quadros/constants/cores-excalidraw.constant';
import { type ElementoExcalidraw } from 'src/modules/quadros/types/elemento-excalidraw';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type OpcoesCenaQuadro } from 'src/modules/quadros/types/opcoes-cena-quadro';
import { quebrarTextoQuadro } from 'src/modules/quadros/utils/layout-diagrama.util';

// 16 e não os 20 do Excalidraw: as caixas do layout automático foram medidas para texto pequeno.
const TAMANHO_FONTE = 16;
const ALTURA_LINHA = 1.25;
const FONTE_EXCALIFONT = 5;
const LARGURA_CARACTERE = TAMANHO_FONTE * 0.65;
const COR_TEXTO = '#1e1e1e';

type Caixa = { x: number; y: number; largura: number; altura: number };

export const sortearSemente = (opcoes: OpcoesCenaQuadro) => Math.floor(opcoes.aleatorio() * 2 ** 31);

export const idDoTextoPreso = (id: string) => `${id}-texto`;

const base = (
  elemento: Pick<ElementoExcalidraw, 'id' | 'type' | 'x' | 'y' | 'width' | 'height'>,
  opcoes: OpcoesCenaQuadro,
): ElementoExcalidraw => ({
  angle: 0,
  strokeColor: COR_TEXTO,
  backgroundColor: 'transparent',
  fillStyle: 'solid',
  strokeWidth: 2,
  strokeStyle: 'solid',
  roughness: 1,
  opacity: 100,
  groupIds: [],
  frameId: null,
  index: null,
  roundness: null,
  seed: sortearSemente(opcoes),
  version: 1,
  versionNonce: sortearSemente(opcoes),
  isDeleted: false,
  boundElements: null,
  updated: opcoes.agora,
  link: null,
  locked: false,
  ...elemento,
});

const criarTexto = (
  id: string,
  conteudo: string,
  caixa: Caixa,
  containerId: string | null,
  strokeColor: string,
  opcoes: OpcoesCenaQuadro,
): ElementoExcalidraw => {
  // O Excalidraw desenha o texto recortado na caixa do elemento e não remede ao abrir: texto preso a uma
  // forma ocupa a largura útil dela (padding de 5 px do Excalidraw), em vez de uma estimativa justa.
  const linhas = containerId === null ? conteudo.split('\n') : quebrarTextoQuadro(conteudo);
  const estimada = Math.max(...linhas.map((linha) => linha.length), 1) * LARGURA_CARACTERE;
  const centralizado = containerId !== null;
  const largura = centralizado ? Math.max(caixa.largura - 10, estimada) : estimada;
  const altura = linhas.length * TAMANHO_FONTE * ALTURA_LINHA;

  return {
    ...base(
      {
        id,
        type: 'text',
        x: centralizado ? caixa.x + (caixa.largura - largura) / 2 : caixa.x,
        y: centralizado ? caixa.y + (caixa.altura - altura) / 2 : caixa.y,
        width: largura,
        height: altura,
      },
      opcoes,
    ),
    strokeColor,
    text: linhas.join('\n'),
    originalText: conteudo,
    fontSize: TAMANHO_FONTE,
    fontFamily: FONTE_EXCALIFONT,
    textAlign: centralizado ? 'center' : 'left',
    verticalAlign: centralizado ? 'middle' : 'top',
    containerId,
    autoResize: true,
    lineHeight: ALTURA_LINHA,
    // A página do editor mede com a fonte de verdade, requebra e tira a marca (quadro-excalidraw/src/medir-textos.ts).
    customData: { medirTexto: true },
  };
};

const converterUm = (elemento: ElementoQuadro, opcoes: OpcoesCenaQuadro): ElementoExcalidraw[] => {
  const cor = CORES_EXCALIDRAW[elemento.cor];
  const caixa: Caixa = { x: elemento.x, y: elemento.y, largura: elemento.largura, altura: elemento.altura };
  const dimensoes = { x: elemento.x, y: elemento.y, width: elemento.largura, height: elemento.altura };

  switch (elemento.tipo) {
    case 'retangulo':
    case 'nota':
    case 'elipse': {
      const comTexto = elemento.texto.trim() !== '';
      const idTexto = idDoTextoPreso(elemento.id);
      const forma: ElementoExcalidraw = {
        ...base({ id: elemento.id, type: elemento.tipo === 'elipse' ? 'ellipse' : 'rectangle', ...dimensoes }, opcoes),
        strokeColor: elemento.tipo === 'nota' ? cor.fundo : cor.traco,
        backgroundColor: cor.fundo,
        roundness: elemento.tipo === 'elipse' ? { type: 2 } : { type: 3 },
        boundElements: comTexto ? [{ id: idTexto, type: 'text' }] : null,
      };

      return comTexto ? [forma, criarTexto(idTexto, elemento.texto, caixa, elemento.id, COR_TEXTO, opcoes)] : [forma];
    }
    case 'texto':
      return [criarTexto(elemento.id, elemento.texto, caixa, null, cor.traco, opcoes)];
    case 'moldura':
      return [{ ...base({ id: elemento.id, type: 'frame', ...dimensoes }, opcoes), name: elemento.texto || null }];
    case 'traco':
    case 'seta': {
      const [inicioX, inicioY] = elemento.pontos[0] ?? [elemento.x, elemento.y];
      const pontos = elemento.pontos.map(([x, y]): [number, number] => [x - inicioX, y - inicioY]);
      const xs = pontos.map(([x]) => x);
      const ys = pontos.map(([, y]) => y);
      const linha = {
        id: elemento.id,
        x: inicioX,
        y: inicioY,
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys),
        points: pontos,
      };

      if (elemento.tipo === 'traco') {
        return [{ ...base({ ...linha, type: 'freedraw' }, opcoes), strokeColor: cor.traco, pressures: [], simulatePressure: true }];
      }

      const rotulo = elemento.texto?.trim() ?? '';
      const idTexto = idDoTextoPreso(elemento.id);
      const seta: ElementoExcalidraw = {
        ...base({ ...linha, type: 'arrow' }, opcoes),
        strokeColor: cor.traco,
        roundness: { type: 2 },
        lastCommittedPoint: null,
        startBinding: elemento.deId ? { elementId: elemento.deId, focus: 0, gap: 4 } : null,
        endBinding: elemento.paraId ? { elementId: elemento.paraId, focus: 0, gap: 4 } : null,
        startArrowhead: null,
        endArrowhead: 'arrow',
        elbowed: false,
        boundElements: rotulo === '' ? null : [{ id: idTexto, type: 'text' }],
      };

      if (rotulo === '') {
        return [seta];
      }

      const [meioX, meioY] = pontos[Math.floor(pontos.length / 2)] ?? [0, 0];
      const caixaRotulo: Caixa = { x: inicioX + meioX - 60, y: inicioY + meioY - 15, largura: 120, altura: 30 };

      return [seta, criarTexto(idTexto, rotulo, caixaRotulo, elemento.id, cor.traco, opcoes)];
    }
  }
};

// Elementos do formato antigo (layout da IA e quadros de antes do Excalidraw) viram elementos do Excalidraw.
// Seta presa a uma forma também entra no `boundElements` da forma, senão o Excalidraw não a move junto.
export const converterParaExcalidraw = (
  novos: ElementoQuadro[],
  existentes: ElementoExcalidraw[],
  opcoes: OpcoesCenaQuadro,
): { criados: ElementoExcalidraw[]; alterados: ElementoExcalidraw[] } => {
  const criados = [...novos].sort((a, b) => a.z - b.z).flatMap((elemento) => converterUm(elemento, opcoes));
  const criadosPorId = new Map(criados.map((elemento) => [elemento.id, elemento]));
  const existentesPorId = new Map(existentes.map((elemento) => [elemento.id, elemento]));
  const alterados = new Map<string, ElementoExcalidraw>();

  for (const seta of criados) {
    for (const ligacao of [seta.startBinding, seta.endBinding]) {
      if (!ligacao) {
        continue;
      }

      const criado = criadosPorId.get(ligacao.elementId);
      const existente = existentesPorId.get(ligacao.elementId);
      const alvo =
        criado ??
        alterados.get(ligacao.elementId) ??
        (existente && !existente.isDeleted
          ? {
              ...existente,
              version: (existente.version ?? 1) + 1,
              versionNonce: sortearSemente(opcoes),
              updated: opcoes.agora,
            }
          : undefined);

      if (!alvo) {
        continue;
      }

      const presos = alvo.boundElements ?? [];

      if (!presos.some((preso) => preso.id === seta.id)) {
        alvo.boundElements = [...presos, { id: seta.id, type: 'arrow' }];
      }

      if (!criado) {
        alterados.set(alvo.id, alvo);
      }
    }
  }

  return { criados, alterados: [...alterados.values()] };
};
