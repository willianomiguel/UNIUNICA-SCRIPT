import { LIMITES_IA_QUADRO } from 'src/modules/quadros/constants/limites-ia-quadro.constant';
import { type EntradaDesenharDiagrama } from 'src/modules/quadros/types/entrada-desenhar-diagrama';
import { type FormaDiagramaQuadro } from 'src/modules/quadros/types/forma-diagrama-quadro';
import { type LigacaoDiagramaQuadro } from 'src/modules/quadros/types/ligacao-diagrama-quadro';
import { type NoDiagramaQuadro } from 'src/modules/quadros/types/no-diagrama-quadro';
import { type ResultadoValidacao } from 'src/modules/quadros/types/resultado-validacao';
import {
  ehObjetoQuadro,
  validarCorOpcional,
  validarQuadroId,
  validarTextoOpcional,
} from 'src/modules/quadros/utils/validar-comum-quadro.util';

const FORMAS: FormaDiagramaQuadro[] = ['retangulo', 'elipse', 'nota'];

export const validarEntradaDesenharDiagrama = (
  entrada: unknown,
): ResultadoValidacao<EntradaDesenharDiagrama> => {
  if (!ehObjetoQuadro(entrada)) {
    return { ok: false, erro: 'Entrada inválida: envie um objeto com quadroId, nos e ligacoes.' };
  }

  const quadroId = validarQuadroId(entrada.quadroId);

  if (!quadroId.ok) {
    return quadroId;
  }

  if (!Array.isArray(entrada.nos) || entrada.nos.length === 0) {
    return { ok: false, erro: 'Informe nos: lista com pelo menos um nó ({ id, texto }).' };
  }

  if (entrada.nos.length > LIMITES_IA_QUADRO.nosMaximo) {
    return {
      ok: false,
      erro: `Nós demais (${entrada.nos.length}); o máximo por diagrama é ${LIMITES_IA_QUADRO.nosMaximo}. Divida em diagramas menores.`,
    };
  }

  const nos: NoDiagramaQuadro[] = [];
  const idsDosNos = new Set<string>();

  for (const [indice, bruto] of entrada.nos.entries()) {
    const onde = `nos[${indice}]`;

    if (!ehObjetoQuadro(bruto)) {
      return { ok: false, erro: `${onde} deve ser um objeto { id, texto }.` };
    }

    if (typeof bruto.id !== 'string' || bruto.id.trim() === '') {
      return { ok: false, erro: `${onde} está sem id (texto curto e único, ex.: "a").` };
    }

    if (bruto.id.length > LIMITES_IA_QUADRO.idMaximo) {
      return { ok: false, erro: `${onde}.id é longo demais (máximo ${LIMITES_IA_QUADRO.idMaximo} caracteres).` };
    }

    if (idsDosNos.has(bruto.id)) {
      return { ok: false, erro: `Id de nó duplicado: "${bruto.id}". Cada nó precisa de um id único.` };
    }

    if (typeof bruto.texto !== 'string' || bruto.texto.trim() === '') {
      return { ok: false, erro: `${onde} (id "${bruto.id}") está sem texto.` };
    }

    const texto = validarTextoOpcional(bruto.texto, `${onde} (id "${bruto.id}")`);

    if (!texto.ok) {
      return texto;
    }

    if (bruto.forma !== undefined && bruto.forma !== null && !FORMAS.includes(bruto.forma as FormaDiagramaQuadro)) {
      return {
        ok: false,
        erro: `Forma inválida em ${onde}: ${JSON.stringify(bruto.forma)}. Formas permitidas: ${FORMAS.join(', ')}.`,
      };
    }

    const cor = validarCorOpcional(bruto.cor, `${onde} (id "${bruto.id}")`);

    if (!cor.ok) {
      return cor;
    }

    idsDosNos.add(bruto.id);
    nos.push({
      id: bruto.id,
      texto: bruto.texto,
      ...(typeof bruto.forma === 'string' ? { forma: bruto.forma as FormaDiagramaQuadro } : {}),
      ...(cor.valor !== undefined ? { cor: cor.valor } : {}),
    });
  }

  const ligacoesBrutas = entrada.ligacoes === undefined || entrada.ligacoes === null ? [] : entrada.ligacoes;

  if (!Array.isArray(ligacoesBrutas)) {
    return { ok: false, erro: 'ligacoes deve ser uma lista de { de, para, texto? }.' };
  }

  if (ligacoesBrutas.length > LIMITES_IA_QUADRO.ligacoesMaximo) {
    return {
      ok: false,
      erro: `Ligações demais (${ligacoesBrutas.length}); o máximo é ${LIMITES_IA_QUADRO.ligacoesMaximo}.`,
    };
  }

  const ligacoes: LigacaoDiagramaQuadro[] = [];

  for (const [indice, bruto] of ligacoesBrutas.entries()) {
    const onde = `ligacoes[${indice}]`;

    if (!ehObjetoQuadro(bruto) || typeof bruto.de !== 'string' || typeof bruto.para !== 'string') {
      return { ok: false, erro: `${onde} deve ser um objeto { de, para, texto? } com ids de nós.` };
    }

    for (const lado of ['de', 'para'] as const) {
      const id = bruto[lado] as string;

      if (!idsDosNos.has(id)) {
        return {
          ok: false,
          erro: `${onde}.${lado} referencia o nó "${id}", que não existe em nos. Nós conhecidos: ${[...idsDosNos].join(', ')}.`,
        };
      }
    }

    if (bruto.de === bruto.para) {
      return { ok: false, erro: `${onde} liga o nó "${bruto.de}" a ele mesmo; isso não é suportado.` };
    }

    const texto = validarTextoOpcional(bruto.texto, onde);

    if (!texto.ok) {
      return texto;
    }

    ligacoes.push({
      de: bruto.de,
      para: bruto.para,
      ...(texto.valor !== undefined && texto.valor !== '' ? { texto: texto.valor } : {}),
    });
  }

  const direcao = entrada.direcao;

  if (direcao !== undefined && direcao !== null && direcao !== 'direita' && direcao !== 'baixo') {
    return { ok: false, erro: `direcao inválida: ${JSON.stringify(direcao)}. Use "direita" ou "baixo".` };
  }

  if (entrada.substituir !== undefined && entrada.substituir !== null && typeof entrada.substituir !== 'boolean') {
    return { ok: false, erro: 'substituir deve ser true ou false.' };
  }

  return {
    ok: true,
    valor: {
      quadroId: quadroId.valor,
      nos,
      ligacoes,
      ...(direcao === 'direita' || direcao === 'baixo' ? { direcao } : {}),
      substituir: entrada.substituir === true,
    },
  };
};
