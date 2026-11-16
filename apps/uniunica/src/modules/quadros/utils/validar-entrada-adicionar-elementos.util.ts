import { LIMITES_IA_QUADRO } from 'src/modules/quadros/constants/limites-ia-quadro.constant';
import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { type ElementoEntradaQuadro } from 'src/modules/quadros/types/elemento-entrada-quadro';
import { type EntradaAdicionarElementos } from 'src/modules/quadros/types/entrada-adicionar-elementos';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';
import { type ResultadoValidacao } from 'src/modules/quadros/types/resultado-validacao';
import { type TipoElementoQuadro } from 'src/modules/quadros/types/tipo-elemento-quadro';
import {
  ehObjetoQuadro,
  validarCorOpcional,
  validarQuadroId,
  validarTextoOpcional,
} from 'src/modules/quadros/utils/validar-comum-quadro.util';

const TIPOS: TipoElementoQuadro[] = ['retangulo', 'elipse', 'nota', 'texto', 'moldura', 'seta', 'traco'];

const NUMEROS = ['x', 'y', 'largura', 'altura'] as const;

export const validarEntradaAdicionarElementos = (
  entrada: unknown,
): ResultadoValidacao<EntradaAdicionarElementos> => {
  if (!ehObjetoQuadro(entrada)) {
    return { ok: false, erro: 'Entrada inválida: envie um objeto com quadroId e elementos.' };
  }

  const quadroId = validarQuadroId(entrada.quadroId);

  if (!quadroId.ok) {
    return quadroId;
  }

  if (!Array.isArray(entrada.elementos) || entrada.elementos.length === 0) {
    return { ok: false, erro: 'Informe elementos: lista com pelo menos um elemento ({ tipo, ... }).' };
  }

  if (entrada.elementos.length > LIMITES_IA_QUADRO.elementosPorChamada) {
    return {
      ok: false,
      erro: `Elementos demais (${entrada.elementos.length}); o máximo por chamada é ${LIMITES_IA_QUADRO.elementosPorChamada}.`,
    };
  }

  const elementos: ElementoEntradaQuadro[] = [];
  const ids = new Set<string>();

  for (const [indice, bruto] of entrada.elementos.entries()) {
    const onde = `elementos[${indice}]`;

    if (!ehObjetoQuadro(bruto)) {
      return { ok: false, erro: `${onde} deve ser um objeto.` };
    }

    if (typeof bruto.tipo !== 'string' || !TIPOS.includes(bruto.tipo as TipoElementoQuadro)) {
      return {
        ok: false,
        erro: `Tipo inválido em ${onde}: ${String(JSON.stringify(bruto.tipo)).slice(0, 80)}. Tipos permitidos: ${TIPOS.join(', ')}.`,
      };
    }

    const tipo = bruto.tipo as TipoElementoQuadro;
    const item: ElementoEntradaQuadro = { tipo };

    if (bruto.id !== undefined && bruto.id !== null) {
      if (typeof bruto.id !== 'string' || bruto.id.trim() === '' || bruto.id.length > LIMITES_IA_QUADRO.idMaximo) {
        return {
          ok: false,
          erro: `${onde}.id deve ser um texto não vazio de até ${LIMITES_IA_QUADRO.idMaximo} caracteres (ou omita para gerar automaticamente).`,
        };
      }

      if (ids.has(bruto.id)) {
        return { ok: false, erro: `Id duplicado na chamada: "${bruto.id}".` };
      }

      ids.add(bruto.id);
      item.id = bruto.id;
    }

    for (const campo of NUMEROS) {
      const valor = bruto[campo];

      if (valor === undefined || valor === null) {
        continue;
      }

      if (typeof valor !== 'number' || !Number.isFinite(valor)) {
        return { ok: false, erro: `${onde}.${campo} deve ser um número.` };
      }

      if ((campo === 'largura' || campo === 'altura') && valor <= 0) {
        return { ok: false, erro: `${onde}.${campo} deve ser maior que zero.` };
      }

      item[campo] = valor;
    }

    const cor = validarCorOpcional(bruto.cor, onde);

    if (!cor.ok) {
      return cor;
    }

    if (cor.valor !== undefined) {
      item.cor = cor.valor;
    }

    const texto = validarTextoOpcional(bruto.texto, onde);

    if (!texto.ok) {
      return texto;
    }

    if (texto.valor !== undefined) {
      item.texto = texto.valor;
    }

    if ((tipo === 'seta' || tipo === 'traco') && bruto.pontos !== undefined && bruto.pontos !== null) {
      if (!Array.isArray(bruto.pontos) || bruto.pontos.length < 2) {
        return { ok: false, erro: `${onde}.pontos deve ser uma lista de pelo menos 2 pontos [x, y].` };
      }

      if (bruto.pontos.length > LIMITES_QUADRO.pontosPorTraco) {
        return {
          ok: false,
          erro: `${onde}.pontos tem ${bruto.pontos.length} pontos; o máximo é ${LIMITES_QUADRO.pontosPorTraco}. Simplifique o traço.`,
        };
      }

      const pontos: PontoQuadro[] = [];

      for (const ponto of bruto.pontos) {
        if (
          !Array.isArray(ponto) ||
          ponto.length < 2 ||
          typeof ponto[0] !== 'number' ||
          typeof ponto[1] !== 'number' ||
          !Number.isFinite(ponto[0]) ||
          !Number.isFinite(ponto[1])
        ) {
          return { ok: false, erro: `${onde}.pontos tem um ponto inválido; use pares numéricos [x, y].` };
        }

        pontos.push([ponto[0], ponto[1]]);
      }

      item.pontos = pontos;
    }

    if (tipo === 'seta') {
      for (const campo of ['deId', 'paraId'] as const) {
        const valor = bruto[campo];

        if (valor === undefined || valor === null) {
          continue;
        }

        if (typeof valor !== 'string' || valor.trim() === '' || valor.length > LIMITES_IA_QUADRO.idMaximo) {
          return { ok: false, erro: `${onde}.${campo} deve ser o id de uma forma.` };
        }

        item[campo] = valor;
      }

      if (item.pontos === undefined && (item.deId === undefined || item.paraId === undefined)) {
        return {
          ok: false,
          erro: `${onde} (seta) precisa de pontos [[x,y],[x,y]] ou então de deId e paraId (ids de formas).`,
        };
      }
    } else if (tipo === 'traco' && item.pontos === undefined) {
      return { ok: false, erro: `${onde} (traco) precisa de pontos.` };
    }

    elementos.push(item);
  }

  return { ok: true, valor: { quadroId: quadroId.valor, elementos } };
};
