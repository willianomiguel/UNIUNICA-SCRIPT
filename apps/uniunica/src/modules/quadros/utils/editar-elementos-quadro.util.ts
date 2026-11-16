import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { type CaixaQuadro } from 'src/modules/quadros/types/caixa-quadro';
import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';
import { type TipoElementoQuadro } from 'src/modules/quadros/types/tipo-elemento-quadro';

type FormaQuadro = 'retangulo' | 'elipse' | 'nota' | 'texto' | 'moldura';
import { atualizarSetasLigadas } from 'src/modules/quadros/utils/ancorar-seta.util';
import { caixaDosPontos } from 'src/modules/quadros/utils/caixa-dos-pontos.util';

// Tamanho usado quando a pessoa só clica (sem arrastar) com uma ferramenta de forma.
const TAMANHO_PADRAO: Record<FormaQuadro, [number, number]> = {
  moldura: [480, 320],
  retangulo: [160, 80],
  elipse: [160, 100],
  nota: [180, 140],
  texto: [200, 40],
};

export const caixaEntrePontos = (a: PontoQuadro, b: PontoQuadro): CaixaQuadro => ({
  x: Math.min(a[0], b[0]),
  y: Math.min(a[1], b[1]),
  largura: Math.abs(b[0] - a[0]),
  altura: Math.abs(b[1] - a[1]),
});

export const proximoZ = (elementos: ElementoQuadro[]): number =>
  elementos.reduce((maior, elemento) => Math.max(maior, elemento.z), 0) + 1;

export const criarForma = ({
  id,
  tipo,
  inicio,
  fim,
  cor,
  z,
}: {
  id: string;
  tipo: FormaQuadro;
  inicio: PontoQuadro;
  fim: PontoQuadro;
  cor: CorQuadro;
  z: number;
}): ElementoQuadro => {
  const caixa = caixaEntrePontos(inicio, fim);
  const foiClique = caixa.largura < LIMITES_QUADRO.tamanhoMinimo && caixa.altura < LIMITES_QUADRO.tamanhoMinimo;
  const [larguraPadrao, alturaPadrao] = TAMANHO_PADRAO[tipo];

  return {
    id,
    tipo,
    cor,
    z,
    texto: '',
    x: caixa.x,
    y: caixa.y,
    largura: foiClique ? larguraPadrao : Math.max(caixa.largura, LIMITES_QUADRO.tamanhoMinimo),
    altura: foiClique ? alturaPadrao : Math.max(caixa.altura, LIMITES_QUADRO.tamanhoMinimo),
  };
};

export const criarLinha = ({
  id,
  tipo,
  pontos,
  cor,
  z,
  deId,
  paraId,
}: {
  id: string;
  tipo: 'seta' | 'traco';
  pontos: PontoQuadro[];
  cor: CorQuadro;
  z: number;
  deId?: string;
  paraId?: string;
}): ElementoQuadro => {
  const caixa = caixaDosPontos(pontos);

  if (tipo === 'traco') {
    return { id, tipo, cor, z, pontos, ...caixa };
  }

  return {
    id,
    tipo,
    cor,
    z,
    pontos,
    ...caixa,
    ...(deId !== undefined ? { deId } : {}),
    ...(paraId !== undefined ? { paraId } : {}),
  };
};

export const ehTipoForma = (tipo: TipoElementoQuadro): tipo is FormaQuadro =>
  tipo === 'retangulo' || tipo === 'elipse' || tipo === 'nota' || tipo === 'texto' || tipo === 'moldura';

const estaDentro = (de: ElementoQuadro, moldura: ElementoQuadro): boolean =>
  de.x >= moldura.x &&
  de.y >= moldura.y &&
  de.x + de.largura <= moldura.x + moldura.largura &&
  de.y + de.altura <= moldura.y + moldura.altura;

// Mover uma moldura leva junto tudo o que está inteiro dentro dela (inclusive molduras internas).
export const expandirComConteudoDasMolduras = (
  elementos: ElementoQuadro[],
  ids: ReadonlySet<string>,
): Set<string> => {
  const resultado = new Set(ids);
  let pendentes = elementos.filter((elemento) => ids.has(elemento.id) && elemento.tipo === 'moldura');

  while (pendentes.length > 0) {
    const proximas: ElementoQuadro[] = [];

    for (const moldura of pendentes) {
      for (const elemento of elementos) {
        if (!resultado.has(elemento.id) && elemento.id !== moldura.id && estaDentro(elemento, moldura)) {
          resultado.add(elemento.id);
          if (elemento.tipo === 'moldura') {
            proximas.push(elemento);
          }
        }
      }
    }
    pendentes = proximas;
  }

  return resultado;
};

// Move os elementos escolhidos. Setas presas acompanham; setas soltas selecionadas se movem inteiras.
export const moverElementos = (
  elementos: ElementoQuadro[],
  ids: ReadonlySet<string>,
  dx: number,
  dy: number,
): ElementoQuadro[] => {
  if (ids.size === 0 || (dx === 0 && dy === 0)) {
    return elementos;
  }

  const movidos = elementos.map((elemento) => {
    if (!ids.has(elemento.id)) {
      return elemento;
    }

    if (elemento.tipo === 'seta' || elemento.tipo === 'traco') {
      const pontos: PontoQuadro[] = elemento.pontos.map(([x, y]) => [x + dx, y + dy]);

      return { ...elemento, pontos, ...caixaDosPontos(pontos) };
    }

    return { ...elemento, x: elemento.x + dx, y: elemento.y + dy };
  });

  return atualizarSetasLigadas(movidos);
};

// Apaga os escolhidos e solta (não apaga) as setas que estavam presas a eles.
export const removerElementosPorId = (
  elementos: ElementoQuadro[],
  ids: ReadonlySet<string>,
): ElementoQuadro[] =>
  elementos
    .filter((elemento) => !ids.has(elemento.id))
    .map((elemento) => {
      if (elemento.tipo !== 'seta') {
        return elemento;
      }

      const { deId, paraId, ...resto } = elemento;

      return {
        ...resto,
        ...(deId !== undefined && !ids.has(deId) ? { deId } : {}),
        ...(paraId !== undefined && !ids.has(paraId) ? { paraId } : {}),
      };
    });

export const atualizarElemento = (
  elementos: ElementoQuadro[],
  id: string,
  mudar: (elemento: ElementoQuadro) => ElementoQuadro,
): ElementoQuadro[] =>
  atualizarSetasLigadas(elementos.map((elemento) => (elemento.id === id ? mudar(elemento) : elemento)));
