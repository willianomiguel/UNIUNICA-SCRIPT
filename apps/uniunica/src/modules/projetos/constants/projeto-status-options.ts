// Opções do campo status de projeto (ordem = colunas do Kanban).
export const PROJETO_STATUS_OPTIONS = [
  { id: '4444bd16-255f-440e-84ce-b946e4dee69f', value: 'IDEIA', label: 'Ideia', position: 0, color: 'gray' },
  { id: 'd3b84f9f-293f-4e7d-9d07-6c1a0da0925d', value: 'PLANEJADO', label: 'Planejado', position: 1, color: 'sky' },
  { id: '2e37df9f-596c-4965-8fe7-a2c4e069809d', value: 'EM_ANDAMENTO', label: 'Em andamento', position: 2, color: 'blue' },
  { id: 'ab61d2d5-f7bc-4a2f-8ba1-e052b716927e', value: 'PAUSADO', label: 'Pausado', position: 3, color: 'orange' },
  { id: 'eedb266b-580f-4bdc-94c6-d5c7c2de3371', value: 'CONCLUIDO', label: 'Concluído', position: 4, color: 'green' },
  { id: '29922c64-9a58-4163-b508-348cd5043a75', value: 'CANCELADO', label: 'Cancelado', position: 5, color: 'red' },
] as const;
