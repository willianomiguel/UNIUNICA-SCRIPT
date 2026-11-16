// Valores reais dos SELECT do objeto lançamento (ver financeiro/constants/lancamento-select-options.ts).
export const TIPOS_LANCAMENTO = ['ENTRADA', 'SAIDA'] as const;

export const STATUS_LANCAMENTO = ['PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO'] as const;

export const FORMAS_PAGAMENTO = [
  'PIX',
  'CARTAO',
  'BOLETO',
  'TRANSFERENCIA',
  'DINHEIRO',
  'OUTRO',
] as const;

// O objeto não tem opção própria para "criado por IA": usa MANUAL e marca as observações.
export const ORIGEM_LANCAMENTO_ASSISTENTE = 'MANUAL';

export const MARCA_OBSERVACAO_ASSISTENTE = 'Lançado pelo assistente de IA.';

export const VALOR_MAXIMO_LANCAMENTO = 1_000_000_000;
