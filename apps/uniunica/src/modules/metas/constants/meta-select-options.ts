// Opções dos campos SELECT da meta.
export const META_SELECT_OPTIONS = {
  unidade: [
    { position: 0, value: 'REAIS', label: 'Reais (R$)', color: 'green' },
    { position: 1, value: 'PERCENTUAL', label: 'Percentual (%)', color: 'blue' },
    { position: 2, value: 'QUANTIDADE', label: 'Quantidade', color: 'purple' },
  ],
  fonte: [
    { position: 0, value: 'MANUAL', label: 'Manual', color: 'gray' },
    { position: 1, value: 'FATURAMENTO_BRUTO', label: 'Faturamento bruto', color: 'green' },
    { position: 2, value: 'FATURAMENTO_LIQUIDO', label: 'Faturamento líquido', color: 'turquoise' },
    { position: 3, value: 'VENDAS_APROVADAS', label: 'Vendas aprovadas', color: 'blue' },
    { position: 4, value: 'TAXA_CHARGEBACK', label: 'Taxa de chargeback', color: 'red' },
    { position: 5, value: 'LUCRO', label: 'Lucro (financeiro)', color: 'yellow' },
    { position: 6, value: 'LEADS', label: 'Leads (tráfego)', color: 'purple' },
    { position: 7, value: 'CLIQUES', label: 'Cliques (tráfego)', color: 'pink' },
  ],
  status: [
    { position: 0, value: 'NO_PRAZO', label: 'No prazo', color: 'green' },
    { position: 1, value: 'EM_RISCO', label: 'Em risco', color: 'orange' },
    { position: 2, value: 'ATRASADA', label: 'Atrasada', color: 'red' },
    { position: 3, value: 'CONCLUIDA', label: 'Concluída', color: 'blue' },
  ],
} as const;
