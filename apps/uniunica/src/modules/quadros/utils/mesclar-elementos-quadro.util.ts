import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { type ElementoEntradaQuadro } from 'src/modules/quadros/types/elemento-entrada-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { atualizarSetasLigadas } from 'src/modules/quadros/utils/ancorar-seta.util';
import { caixaDosElementos } from 'src/modules/quadros/utils/caixa-dos-elementos.util';
import { conferirTamanhoConteudoQuadro } from 'src/modules/quadros/utils/conferir-tamanho-conteudo-quadro.util';
import { gerarIdQuadro } from 'src/modules/quadros/utils/gerar-id-quadro.util';
import { normalizarElemento } from 'src/modules/quadros/utils/normalizar-conteudo-quadro.util';

export type ResultadoMesclaElementos =
  | { ok: true; conteudo: ConteudoQuadro; idsCriados: string[] }
  | { ok: false; erro: string };

const TIPOS_DE_FORMA = new Set(['retangulo', 'elipse', 'nota', 'texto']);

export const mesclarElementosQuadro = (
  atual: ConteudoQuadro,
  novos: ElementoEntradaQuadro[],
): ResultadoMesclaElementos => {
  const idsExistentes = new Set(atual.elementos.map((elemento) => elemento.id));
  const caixa = caixaDosElementos(atual.elementos);
  const zMaximo = atual.elementos.reduce((maior, elemento) => Math.max(maior, elemento.z), -1);
  // Formas sem posição vão abaixo do desenho atual, empilhadas.
  let proximoY = caixa ? caixa.y + caixa.altura + 80 : 0;
  const xPadrao = caixa ? caixa.x : 0;
  const criados: ElementoQuadro[] = [];

  for (const [indice, entrada] of novos.entries()) {
    const id = entrada.id ?? gerarIdQuadro();

    if (idsExistentes.has(id) || criados.some((elemento) => elemento.id === id)) {
      return { ok: false, erro: `Já existe um elemento com o id "${id}" no quadro. Omita o id ou escolha outro.` };
    }

    const ehForma = TIPOS_DE_FORMA.has(entrada.tipo);
    const altura = entrada.altura ?? 80;
    const bruto: Record<string, unknown> = {
      ...entrada,
      id,
      z: zMaximo + 1 + indice,
    };

    if (ehForma) {
      if (entrada.x === undefined || entrada.y === undefined) {
        bruto.x = entrada.x ?? xPadrao;
        bruto.y = entrada.y ?? proximoY;
        proximoY = (entrada.y ?? proximoY) + altura + 40;
      }
    } else if (entrada.tipo === 'seta' && entrada.pontos === undefined) {
      // Marcador: as pontas reais saem de atualizarSetasLigadas.
      bruto.pontos = [
        [0, 0],
        [1, 0],
      ];
    }

    const elemento = normalizarElemento(bruto, indice);

    if (elemento === null) {
      return { ok: false, erro: `Elemento ${indice} (${entrada.tipo}) inválido: faltam pontos.` };
    }

    criados.push(elemento);
  }

  const todos = [...atual.elementos, ...criados];

  if (todos.length > LIMITES_QUADRO.elementosMaximo) {
    return { ok: false, erro: `O quadro passaria de ${LIMITES_QUADRO.elementosMaximo} elementos.` };
  }

  const formasPorId = new Map(
    todos.filter((elemento) => TIPOS_DE_FORMA.has(elemento.tipo)).map((elemento) => [elemento.id, elemento]),
  );

  for (const elemento of criados) {
    if (elemento.tipo !== 'seta') {
      continue;
    }

    for (const [campo, referencia] of [
      ['deId', elemento.deId],
      ['paraId', elemento.paraId],
    ] as const) {
      if (referencia !== undefined && !formasPorId.has(referencia)) {
        return {
          ok: false,
          erro: `A seta "${elemento.id}" referencia ${campo} "${referencia}", que não é uma forma existente no quadro (use quadro_ler para ver os ids).`,
        };
      }
    }
  }

  const conteudo: ConteudoQuadro = { ...atual, elementos: atualizarSetasLigadas(todos) };
  const grandeDemais = conferirTamanhoConteudoQuadro(conteudo);

  if (grandeDemais !== null) {
    return { ok: false, erro: grandeDemais };
  }

  return {
    ok: true,
    conteudo,
    idsCriados: criados.map((elemento) => elemento.id),
  };
};
