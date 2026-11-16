import { LIMITES_ASSISTENTE } from 'src/modules/assistente/constants/assistente-limites';
import { FORMAS_PAGAMENTO, STATUS_LANCAMENTO, VALOR_MAXIMO_LANCAMENTO } from 'src/modules/assistente/constants/assistente-opcoes-lancamento';
import { type EntradaLancar } from 'src/modules/assistente/types/entrada-lancar';
import { type ResultadoValidacao } from 'src/modules/assistente/types/resultado-validacao';
import { ehDataIsoValida } from 'src/modules/assistente/utils/eh-data-iso-valida.util';
import { normalizarTextoBusca } from 'src/modules/assistente/utils/normalizar-texto-busca.util';
import { reaisParaCentavos } from 'src/modules/assistente/utils/reais-para-centavos.util';

const ALIAS_TIPO: Record<string, EntradaLancar['tipo']> = {
  entrada: 'ENTRADA',
  receita: 'ENTRADA',
  recebimento: 'ENTRADA',
  saida: 'SAIDA',
  despesa: 'SAIDA',
  gasto: 'SAIDA',
  custo: 'SAIDA',
  pagamento: 'SAIDA',
};

const ALIAS_FORMA_PAGAMENTO: Record<string, (typeof FORMAS_PAGAMENTO)[number]> = {
  pix: 'PIX',
  cartao: 'CARTAO',
  'cartao de credito': 'CARTAO',
  'cartao de debito': 'CARTAO',
  credito: 'CARTAO',
  debito: 'CARTAO',
  boleto: 'BOLETO',
  transferencia: 'TRANSFERENCIA',
  ted: 'TRANSFERENCIA',
  doc: 'TRANSFERENCIA',
  dinheiro: 'DINHEIRO',
  especie: 'DINHEIRO',
  outro: 'OUTRO',
};

// Aceita número ou texto numérico ("12.5", "12,50", "1.234,56"); o resto vira null.
const lerValorEmReais = (bruto: unknown): number | null => {
  if (typeof bruto === 'number') {
    return Number.isFinite(bruto) ? bruto : null;
  }

  if (typeof bruto !== 'string') {
    return null;
  }

  const texto = bruto.trim().replace(/^R\$\s*/i, '');

  if (/^\d{1,3}(\.\d{3})+,\d+$/.test(texto)) {
    return Number(texto.replace(/\./g, '').replace(',', '.'));
  }

  if (/^\d+([.,]\d+)?$/.test(texto)) {
    return Number(texto.replace(',', '.'));
  }

  return null;
};

const estaAusente = (bruto: unknown): boolean => bruto === undefined || bruto === null || bruto === '';

const lerTextoOpcional = (bruto: unknown, campo: string, maximo: number): ResultadoValidacao<string | null> => {
  if (estaAusente(bruto)) {
    return { ok: true, valor: null };
  }

  if (typeof bruto !== 'string') {
    return { ok: false, erro: `"${campo}" deve ser um texto.` };
  }

  const texto = bruto.trim();

  if (texto.length > maximo) {
    return { ok: false, erro: `"${campo}" passou de ${maximo} caracteres.` };
  }

  return { ok: true, valor: texto === '' ? null : texto };
};

const ANOS_MAXIMOS_DE_HOJE = 2;

const limiteDeAnos = (hoje: string, anos: number): string => {
  const data = new Date(`${hoje}T00:00:00Z`);

  data.setUTCFullYear(data.getUTCFullYear() + anos);

  return data.toISOString().slice(0, 10);
};

const lerDataOpcional = (bruto: unknown, campo: string, hoje: string): ResultadoValidacao<string | null> => {
  if (estaAusente(bruto)) {
    return { ok: true, valor: null };
  }

  if (!ehDataIsoValida(bruto)) {
    return { ok: false, erro: `Data inválida em "${campo}": use o formato AAAA-MM-DD e um dia que exista.` };
  }

  if (bruto < limiteDeAnos(hoje, -ANOS_MAXIMOS_DE_HOJE) || bruto > limiteDeAnos(hoje, ANOS_MAXIMOS_DE_HOJE)) {
    return { ok: false, erro: `"${campo}" deve estar a no máximo ${ANOS_MAXIMOS_DE_HOJE} anos de hoje.` };
  }

  return { ok: true, valor: bruto };
};

// Valida a entrada de financeiro_lancar e já converte o valor para centavos inteiros.
export const validarEntradaLancar = (
  entrada: unknown,
  hoje: string,
): ResultadoValidacao<EntradaLancar> => {
  if (typeof entrada !== 'object' || entrada === null || Array.isArray(entrada)) {
    return { ok: false, erro: 'Entrada inválida: envie um objeto com descricao, valor e tipo.' };
  }

  const registro = entrada as Record<string, unknown>;
  const descricao = typeof registro.descricao === 'string' ? registro.descricao.trim() : '';

  if (descricao === '') {
    return { ok: false, erro: 'Informe a descrição do lançamento.' };
  }

  if (descricao.length > LIMITES_ASSISTENTE.descricaoMaxima) {
    return { ok: false, erro: `A descrição passou de ${LIMITES_ASSISTENTE.descricaoMaxima} caracteres.` };
  }

  const valor = lerValorEmReais(registro.valor);

  if (valor === null) {
    return { ok: false, erro: 'Valor inválido: informe um número em reais (ex.: 150.5).' };
  }

  if (valor <= 0) {
    return { ok: false, erro: 'O valor deve ser maior que zero (use "tipo" para dizer se é receita ou despesa).' };
  }

  if (valor > VALOR_MAXIMO_LANCAMENTO) {
    return { ok: false, erro: 'Valor alto demais: confirme com o usuário.' };
  }

  const centavosExatos = Number((valor * 100).toPrecision(15));

  if (Math.abs(centavosExatos - Math.round(centavosExatos)) > 1e-6) {
    return { ok: false, erro: 'Valor com mais de 2 casas decimais: informe no máximo centavos (ex.: 10.50).' };
  }

  const valorCentavos = reaisParaCentavos(valor);

  if (valorCentavos <= 0) {
    return { ok: false, erro: 'O valor é menor que 1 centavo.' };
  }

  const tipo = typeof registro.tipo === 'string' ? ALIAS_TIPO[normalizarTextoBusca(registro.tipo)] : undefined;

  if (!tipo) {
    return { ok: false, erro: 'Tipo inválido: use ENTRADA (receita) ou SAIDA (despesa).' };
  }

  const categoria = lerTextoOpcional(registro.categoria, 'categoria', LIMITES_ASSISTENTE.descricaoMaxima);

  if (!categoria.ok) {
    return categoria;
  }

  const data = lerDataOpcional(registro.data, 'data', hoje);

  if (!data.ok) {
    return data;
  }

  const vencimento = lerDataOpcional(registro.vencimento, 'vencimento', hoje);

  if (!vencimento.ok) {
    return vencimento;
  }

  const observacoes = lerTextoOpcional(registro.observacoes, 'observacoes', LIMITES_ASSISTENTE.observacoesMaxima);

  if (!observacoes.ok) {
    return observacoes;
  }

  const dataFinal = data.valor ?? hoje;
  let status: EntradaLancar['status'] = dataFinal <= hoje ? 'PAGO' : 'PENDENTE';

  if (!estaAusente(registro.status)) {
    const candidato = typeof registro.status === 'string' ? registro.status.trim().toUpperCase() : '';
    const encontrado = STATUS_LANCAMENTO.find((opcao) => opcao === candidato);

    if (!encontrado) {
      return { ok: false, erro: `Status inválido: use ${STATUS_LANCAMENTO.join(', ')}.` };
    }

    status = encontrado;
  }

  let formaPagamento: string | null = null;

  if (!estaAusente(registro.formaPagamento)) {
    const forma =
      typeof registro.formaPagamento === 'string'
        ? ALIAS_FORMA_PAGAMENTO[normalizarTextoBusca(registro.formaPagamento)]
        : undefined;

    if (!forma) {
      return { ok: false, erro: `Forma de pagamento inválida: use ${FORMAS_PAGAMENTO.join(', ')}.` };
    }

    formaPagamento = forma;
  }

  return {
    ok: true,
    valor: {
      descricao,
      valorCentavos,
      tipo,
      categoria: categoria.valor,
      data: dataFinal,
      vencimento: vencimento.valor,
      status,
      formaPagamento,
      observacoes: observacoes.valor,
    },
  };
};
