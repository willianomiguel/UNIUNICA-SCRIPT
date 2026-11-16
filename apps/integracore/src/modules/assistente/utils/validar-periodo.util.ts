import { type IntervaloIso } from 'src/modules/assistente/types/intervalo-iso';
import { type PadraoPeriodo } from 'src/modules/assistente/types/padrao-periodo';
import { type ResultadoValidacao } from 'src/modules/assistente/types/resultado-validacao';
import { ehDataIsoValida } from 'src/modules/assistente/utils/eh-data-iso-valida.util';
import { primeiroDiaDoMes } from 'src/modules/assistente/utils/primeiro-dia-do-mes.util';
import { ultimoDiaDoMes } from 'src/modules/assistente/utils/ultimo-dia-do-mes.util';
import { somarDias } from 'src/modules/trafego/utils/somar-dias.util';

const ANO_MINIMO = 2000;
const ANO_MAXIMO = 2100;
const MAXIMO_DIAS_PERIODO = 1096;
const MS_POR_DIA = 86_400_000;

const lerData = (
  entrada: Record<string, unknown>,
  campo: 'inicio' | 'fim',
): ResultadoValidacao<string | null> => {
  const bruto = entrada[campo];

  if (bruto === undefined || bruto === null || bruto === '') {
    return { ok: true, valor: null };
  }

  if (!ehDataIsoValida(bruto)) {
    return { ok: false, erro: `Data inválida em "${campo}": use o formato AAAA-MM-DD e um dia que exista.` };
  }

  const ano = Number(bruto.slice(0, 4));

  if (ano < ANO_MINIMO || ano > ANO_MAXIMO) {
    return { ok: false, erro: `Ano fora do limite em "${campo}": use datas entre ${ANO_MINIMO} e ${ANO_MAXIMO}.` };
  }

  return { ok: true, valor: bruto };
};

const fimPadrao = (hoje: string, padrao: PadraoPeriodo): string =>
  padrao.tipo === 'MES_COMPLETO' ? ultimoDiaDoMes(hoje) : hoje;

const inicioPadrao = (fim: string, padrao: PadraoPeriodo): string =>
  padrao.tipo === 'ULTIMOS_DIAS' ? somarDias(fim, -(padrao.dias - 1)) : primeiroDiaDoMes(fim);

// Valida `inicio`/`fim` opcionais (AAAA-MM-DD) e completa o que faltar com o período padrão.
export const validarPeriodo = (
  entrada: unknown,
  hoje: string,
  padrao: PadraoPeriodo,
): ResultadoValidacao<IntervaloIso> => {
  const objeto = entrada === undefined || entrada === null ? {} : entrada;

  if (typeof objeto !== 'object' || Array.isArray(objeto)) {
    return { ok: false, erro: 'Entrada inválida: envie um objeto (ou nada) com inicio e fim opcionais.' };
  }

  const registro = objeto as Record<string, unknown>;
  const inicio = lerData(registro, 'inicio');

  if (!inicio.ok) {
    return inicio;
  }

  const fim = lerData(registro, 'fim');

  if (!fim.ok) {
    return fim;
  }

  const limitePadrao = fimPadrao(hoje, padrao);
  const fimFinal = fim.valor ?? (inicio.valor && inicio.valor > limitePadrao ? inicio.valor : limitePadrao);
  const inicioFinal = inicio.valor ?? inicioPadrao(fimFinal, padrao);

  if (fimFinal < inicioFinal) {
    return { ok: false, erro: 'Período inválido: "fim" não pode ser anterior a "inicio".' };
  }

  const dias = (Date.parse(`${fimFinal}T00:00:00Z`) - Date.parse(`${inicioFinal}T00:00:00Z`)) / MS_POR_DIA + 1;

  if (dias > MAXIMO_DIAS_PERIODO) {
    return { ok: false, erro: `Período grande demais: o máximo é de 3 anos (${MAXIMO_DIAS_PERIODO} dias).` };
  }

  return { ok: true, valor: { inicio: inicioFinal, fim: fimFinal } };
};
