import { CORES_QUADRO, COR_PADRAO_QUADRO } from 'src/modules/quadros/constants/cores-quadro.constant';
import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { type CameraQuadro } from 'src/modules/quadros/types/camera-quadro';
import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';
import { caixaDosPontos } from 'src/modules/quadros/utils/caixa-dos-pontos.util';

const CORES_VALIDAS = new Set<string>(CORES_QUADRO.map((cor) => cor.valor));
const TIPOS_COM_TEXTO = new Set(['retangulo', 'elipse', 'nota', 'texto', 'moldura']);

const ehObjeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null && !Array.isArray(valor);

const numero = (valor: unknown, padrao: number): number => {
  const convertido = typeof valor === 'string' ? Number(valor) : valor;

  if (typeof convertido !== 'number' || !Number.isFinite(convertido)) {
    return padrao;
  }

  const limite = LIMITES_QUADRO.coordenadaMaxima;

  return Math.min(Math.max(convertido, -limite), limite);
};

const texto = (valor: unknown): string =>
  typeof valor === 'string' ? valor.slice(0, LIMITES_QUADRO.textoMaximo) : '';

export const normalizarCor = (valor: unknown): CorQuadro =>
  typeof valor === 'string' && CORES_VALIDAS.has(valor) ? (valor as CorQuadro) : COR_PADRAO_QUADRO;

const normalizarPontos = (valor: unknown): PontoQuadro[] => {
  if (!Array.isArray(valor)) {
    return [];
  }

  const pontos: PontoQuadro[] = [];

  for (const ponto of valor.slice(0, LIMITES_QUADRO.pontosPorTraco)) {
    if (Array.isArray(ponto) && ponto.length >= 2) {
      const x = numero(ponto[0], Number.NaN);
      const y = numero(ponto[1], Number.NaN);

      if (Number.isFinite(x) && Number.isFinite(y)) {
        pontos.push([x, y]);
      }
    }
  }

  return pontos;
};

const normalizarCamera = (valor: unknown): CameraQuadro | undefined => {
  if (!ehObjeto(valor)) {
    return undefined;
  }

  const zoom = numero(valor.zoom, 1);

  return {
    x: numero(valor.x, 0),
    y: numero(valor.y, 0),
    zoom: Math.min(Math.max(zoom, LIMITES_QUADRO.zoomMinimo), LIMITES_QUADRO.zoomMaximo),
  };
};

// Devolve null quando o item não dá para aproveitar (sem tipo conhecido, seta/traço sem pontos).
export const normalizarElemento = (valor: unknown, indice: number): ElementoQuadro | null => {
  if (!ehObjeto(valor) || typeof valor.tipo !== 'string') {
    return null;
  }

  const id = typeof valor.id === 'string' && valor.id.trim() !== '' ? valor.id : `elemento-${indice}`;
  const base = {
    id,
    x: numero(valor.x, 0),
    y: numero(valor.y, 0),
    largura: Math.abs(numero(valor.largura, 160)),
    altura: Math.abs(numero(valor.altura, 80)),
    cor: normalizarCor(valor.cor),
    z: numero(valor.z, indice),
  };

  if (TIPOS_COM_TEXTO.has(valor.tipo)) {
    return {
      ...base,
      tipo: valor.tipo as 'retangulo' | 'elipse' | 'nota' | 'texto' | 'moldura',
      texto: texto(valor.texto),
    };
  }

  if (valor.tipo === 'seta' || valor.tipo === 'traco') {
    const pontos = normalizarPontos(valor.pontos);

    if (pontos.length < 2) {
      return null;
    }

    const caixa = caixaDosPontos(pontos);

    if (valor.tipo === 'traco') {
      return { ...base, ...caixa, tipo: 'traco', pontos };
    }

    return {
      ...base,
      ...caixa,
      tipo: 'seta',
      pontos,
      ...(typeof valor.deId === 'string' ? { deId: valor.deId } : {}),
      ...(typeof valor.paraId === 'string' ? { paraId: valor.paraId } : {}),
      ...(typeof valor.texto === 'string' && valor.texto !== '' ? { texto: texto(valor.texto) } : {}),
    };
  }

  return null;
};

// Aceita o que vier do banco (objeto, string JSON, null, lixo) e devolve sempre um conteúdo válido.
export const normalizarConteudoQuadro = (bruto: unknown): ConteudoQuadro => {
  let valor = bruto;

  if (typeof valor === 'string') {
    try {
      valor = JSON.parse(valor);
    } catch {
      valor = null;
    }
  }

  if (!ehObjeto(valor)) {
    return { versao: 1, elementos: [] };
  }

  const lista = Array.isArray(valor.elementos) ? valor.elementos : [];
  const elementos: ElementoQuadro[] = [];
  const idsVistos = new Set<string>();

  lista.slice(0, LIMITES_QUADRO.elementosMaximo).forEach((item, indice) => {
    const elemento = normalizarElemento(item, indice);

    if (elemento === null) {
      return;
    }

    const id = idsVistos.has(elemento.id) ? `${elemento.id}-${indice}` : elemento.id;

    idsVistos.add(id);
    elementos.push({ ...elemento, id });
  });

  // Seta presa a um elemento que não existe mais vira seta solta.
  const elementosFinais = elementos.map((elemento) => {
    if (elemento.tipo !== 'seta') {
      return elemento;
    }

    const { deId, paraId, ...resto } = elemento;

    return {
      ...resto,
      ...(deId !== undefined && idsVistos.has(deId) ? { deId } : {}),
      ...(paraId !== undefined && idsVistos.has(paraId) ? { paraId } : {}),
    };
  });

  const camera = normalizarCamera(valor.camera);

  return { versao: 1, elementos: elementosFinais, ...(camera ? { camera } : {}) };
};
