import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';
import { atualizarSetasLigadas } from 'src/modules/quadros/utils/ancorar-seta.util';
import { caixaDosElementos } from 'src/modules/quadros/utils/caixa-dos-elementos.util';
import { caixaDosPontos } from 'src/modules/quadros/utils/caixa-dos-pontos.util';

const deslocar = (elemento: ElementoQuadro, dx: number, dy: number): ElementoQuadro => {
  if (elemento.tipo === 'seta' || elemento.tipo === 'traco') {
    const pontos: PontoQuadro[] = elemento.pontos.map(([x, y]) => [x + dx, y + dy]);

    return { ...elemento, pontos, ...caixaDosPontos(pontos) };
  }

  return { ...elemento, x: elemento.x + dx, y: elemento.y + dy };
};

// Cria cópias com ids novos; setas entre elementos copiados passam a ligar as cópias.
export const copiasDeElementos = (
  originais: ElementoQuadro[],
  existentes: ElementoQuadro[],
  gerarId: () => string,
  dx: number,
  dy: number,
): ElementoQuadro[] => {
  const novoId = new Map(originais.map((elemento) => [elemento.id, gerarId()]));
  const zBase = existentes.reduce((maior, elemento) => Math.max(maior, elemento.z), 0) + 1;
  const ordenados = [...originais].sort((a, b) => a.z - b.z);

  return ordenados.map((elemento, indice) => {
    const copia = { ...deslocar(elemento, dx, dy), id: novoId.get(elemento.id) as string, z: zBase + indice };

    if (copia.tipo !== 'seta') {
      return copia;
    }

    const { deId, paraId, ...resto } = copia;
    const novoDe = deId !== undefined ? (novoId.get(deId) ?? (existentes.some((e) => e.id === deId) ? deId : undefined)) : undefined;
    const novoPara =
      paraId !== undefined ? (novoId.get(paraId) ?? (existentes.some((e) => e.id === paraId) ? paraId : undefined)) : undefined;

    return { ...resto, ...(novoDe ? { deId: novoDe } : {}), ...(novoPara ? { paraId: novoPara } : {}) };
  });
};

export const duplicarElementos = (
  elementos: ElementoQuadro[],
  ids: ReadonlySet<string>,
  gerarId: () => string,
  deslocamento = 24,
): { elementos: ElementoQuadro[]; idsNovos: string[] } => {
  const copias = copiasDeElementos(
    elementos.filter((elemento) => ids.has(elemento.id)),
    elementos,
    gerarId,
    deslocamento,
    deslocamento,
  );

  return { elementos: atualizarSetasLigadas([...elementos, ...copias]), idsNovos: copias.map((copia) => copia.id) };
};

// Cola o que foi copiado com o canto da seleção no ponto pedido (ou um pouco deslocado do original).
export const colarElementos = (
  elementos: ElementoQuadro[],
  copiados: ElementoQuadro[],
  gerarId: () => string,
  ponto?: PontoQuadro,
): { elementos: ElementoQuadro[]; idsNovos: string[] } => {
  const caixa = caixaDosElementos(copiados);

  if (caixa === null) {
    return { elementos, idsNovos: [] };
  }

  const dx = ponto ? ponto[0] - caixa.x : 24;
  const dy = ponto ? ponto[1] - caixa.y : 24;
  const copias = copiasDeElementos(copiados, elementos, gerarId, dx, dy);

  return { elementos: atualizarSetasLigadas([...elementos, ...copias]), idsNovos: copias.map((copia) => copia.id) };
};

export const trazerParaFrente = (elementos: ElementoQuadro[], ids: ReadonlySet<string>): ElementoQuadro[] => {
  let proximo = elementos.reduce((maior, elemento) => Math.max(maior, elemento.z), 0) + 1;

  return elementos.map((elemento) => (ids.has(elemento.id) ? { ...elemento, z: proximo++ } : elemento));
};

export const enviarParaTras = (elementos: ElementoQuadro[], ids: ReadonlySet<string>): ElementoQuadro[] => {
  let proximo = elementos.reduce((menor, elemento) => Math.min(menor, elemento.z), 0) - ids.size;

  return elementos.map((elemento) => (ids.has(elemento.id) ? { ...elemento, z: proximo++ } : elemento));
};

export const MARGEM_MOLDURA = 32;

// Moldura nova em volta dos escolhidos (o título fica acima da borda).
export const envolverEmMoldura = (
  elementos: ElementoQuadro[],
  ids: ReadonlySet<string>,
  id: string,
  titulo = 'Nova seção',
): ElementoQuadro[] => {
  const caixa = caixaDosElementos(elementos.filter((elemento) => ids.has(elemento.id)));

  if (caixa === null) {
    return elementos;
  }

  const zMinimo = elementos.reduce((menor, elemento) => Math.min(menor, elemento.z), 0);

  return [
    ...elementos,
    {
      id,
      tipo: 'moldura',
      texto: titulo,
      cor: 'gray',
      z: zMinimo - 1,
      x: caixa.x - MARGEM_MOLDURA,
      y: caixa.y - MARGEM_MOLDURA,
      largura: caixa.largura + MARGEM_MOLDURA * 2,
      altura: caixa.altura + MARGEM_MOLDURA * 2,
    },
  ];
};
