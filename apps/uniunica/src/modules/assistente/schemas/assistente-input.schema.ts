import { type InputJsonSchema } from 'twenty-sdk/logic-function';

import { FORMAS_PAGAMENTO, STATUS_LANCAMENTO, TIPOS_LANCAMENTO } from 'src/modules/assistente/constants/assistente-opcoes-lancamento';

const propriedadeInicio = (padrao: string): InputJsonSchema => ({
  type: 'string',
  description: `Primeiro dia do período, AAAA-MM-DD. Opcional; padrão: ${padrao}.`,
});

const propriedadeFim = (padrao: string): InputJsonSchema => ({
  type: 'string',
  description: `Último dia do período (inclusive), AAAA-MM-DD. Opcional; padrão: ${padrao}.`,
});

export const financeiroResumoInputSchema: InputJsonSchema = {
  type: 'object',
  properties: {
    inicio: propriedadeInicio('primeiro dia do mês atual'),
    fim: propriedadeFim('último dia do mês atual'),
  },
  additionalProperties: false,
};

export const financeiroLancarInputSchema: InputJsonSchema = {
  type: 'object',
  properties: {
    descricao: { type: 'string', description: 'Descrição do lançamento (ex.: "Assinatura Notion").' },
    valor: { type: 'number', description: 'Valor em reais, maior que zero (ex.: 150.5). O sinal vem de "tipo".' },
    tipo: {
      type: 'string',
      enum: [...TIPOS_LANCAMENTO],
      description: 'ENTRADA = receita (dinheiro que entra); SAIDA = despesa (dinheiro que sai).',
    },
    categoria: {
      type: 'string',
      description: 'Nome da categoria financeira (ex.: "Ferramentas/SaaS"). Opcional. Se não existir, a ferramenta devolve as categorias disponíveis.',
    },
    data: { type: 'string', description: 'Data do lançamento, AAAA-MM-DD. Padrão: hoje.' },
    vencimento: { type: 'string', description: 'Data de vencimento, AAAA-MM-DD. Padrão: igual à data.' },
    status: {
      type: 'string',
      enum: [...STATUS_LANCAMENTO],
      description: 'Padrão: PAGO se a data é hoje ou passada; PENDENTE se é futura.',
    },
    formaPagamento: { type: 'string', enum: [...FORMAS_PAGAMENTO], description: 'Forma de pagamento. Opcional.' },
    observacoes: { type: 'string', description: 'Observações livres. Opcional.' },
  },
  required: ['descricao', 'valor', 'tipo'],
  additionalProperties: false,
};

export const metasSituacaoInputSchema: InputJsonSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['NO_PRAZO', 'EM_RISCO', 'ATRASADA', 'CONCLUIDA'],
      description: 'Só metas com este status. Opcional.',
    },
    busca: { type: 'string', description: 'Texto contido no título da meta. Opcional.' },
  },
  additionalProperties: false,
};

export const trafegoDesempenhoInputSchema: InputJsonSchema = {
  type: 'object',
  properties: {
    inicio: propriedadeInicio('30 dias atrás'),
    fim: propriedadeFim('hoje'),
    campanha: { type: 'string', description: 'Texto contido no nome da campanha. Opcional; sem ele traz todas.' },
  },
  additionalProperties: false,
};

export const vendasResumoInputSchema: InputJsonSchema = {
  type: 'object',
  properties: {
    inicio: propriedadeInicio('primeiro dia do mês atual'),
    fim: propriedadeFim('hoje'),
  },
  additionalProperties: false,
};

export const sprintsSituacaoInputSchema: InputJsonSchema = {
  type: 'object',
  properties: {
    sprintId: { type: 'string', description: 'Id (UUID) da sprint, de find_many_sprints. Opcional; padrão: a sprint ativa.' },
  },
  additionalProperties: false,
};
