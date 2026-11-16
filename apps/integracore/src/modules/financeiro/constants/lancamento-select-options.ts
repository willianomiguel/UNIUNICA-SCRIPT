// Opções dos campos SELECT do lançamento (valores em MAIÚSCULAS, rótulos em português).
export const LANCAMENTO_SELECT_OPTIONS = {
  tipo: [
    { position: 0, value: 'ENTRADA', label: 'Entrada', color: 'green' },
    { position: 1, value: 'SAIDA', label: 'Saída', color: 'red' },
  ],
  status: [
    { position: 0, value: 'PENDENTE', label: 'Pendente', color: 'yellow' },
    { position: 1, value: 'PAGO', label: 'Pago', color: 'green' },
    { position: 2, value: 'ATRASADO', label: 'Atrasado', color: 'red' },
    { position: 3, value: 'CANCELADO', label: 'Cancelado', color: 'gray' },
  ],
  recorrencia: [
    { position: 0, value: 'NENHUMA', label: 'Nenhuma', color: 'gray' },
    { position: 1, value: 'SEMANAL', label: 'Semanal', color: 'sky' },
    { position: 2, value: 'MENSAL', label: 'Mensal', color: 'blue' },
    { position: 3, value: 'TRIMESTRAL', label: 'Trimestral', color: 'purple' },
    { position: 4, value: 'ANUAL', label: 'Anual', color: 'pink' },
  ],
  formaPagamento: [
    { position: 0, value: 'PIX', label: 'Pix', color: 'turquoise' },
    { position: 1, value: 'CARTAO', label: 'Cartão', color: 'blue' },
    { position: 2, value: 'BOLETO', label: 'Boleto', color: 'orange' },
    {
      position: 3,
      value: 'TRANSFERENCIA',
      label: 'Transferência',
      color: 'purple',
    },
    { position: 4, value: 'DINHEIRO', label: 'Dinheiro', color: 'green' },
    { position: 5, value: 'OUTRO', label: 'Outro', color: 'gray' },
  ],
  centroCusto: [
    { position: 0, value: 'DEV', label: 'Desenvolvimento', color: 'blue' },
    { position: 1, value: 'MARKETING', label: 'Marketing', color: 'pink' },
    { position: 2, value: 'ESTRATEGIA', label: 'Estratégia', color: 'purple' },
    {
      position: 3,
      value: 'ADMINISTRATIVO',
      label: 'Administrativo',
      color: 'orange',
    },
    { position: 4, value: 'OUTRO', label: 'Outro', color: 'gray' },
  ],
  origem: [
    { position: 0, value: 'MANUAL', label: 'Manual', color: 'gray' },
    { position: 1, value: 'VENDA', label: 'Venda', color: 'green' },
    { position: 2, value: 'RECORRENCIA', label: 'Recorrência', color: 'blue' },
  ],
  categoriaCor: [
    { position: 0, value: 'VERDE', label: 'Verde', color: 'green' },
    { position: 1, value: 'AZUL', label: 'Azul', color: 'blue' },
    { position: 2, value: 'ROXO', label: 'Roxo', color: 'purple' },
    { position: 3, value: 'ROSA', label: 'Rosa', color: 'pink' },
    { position: 4, value: 'LARANJA', label: 'Laranja', color: 'orange' },
    { position: 5, value: 'AMARELO', label: 'Amarelo', color: 'yellow' },
    { position: 6, value: 'VERMELHO', label: 'Vermelho', color: 'red' },
    { position: 7, value: 'CINZA', label: 'Cinza', color: 'gray' },
  ],
} as const;
