// Opções do campo status de ideia (ordem = colunas do Kanban).
export const IDEIA_STATUS_OPTIONS = [
  { id: 'f0e23114-25c7-4b0a-b3df-f3f9ae95c690', value: 'NOVA', label: 'Nova', position: 0, color: 'sky' },
  { id: '0cd23970-7af8-4e38-9edd-1c1191c4f68e', value: 'EM_ANALISE', label: 'Em análise', position: 1, color: 'yellow' },
  { id: '16fd7f6b-0f58-495a-b4e9-c242856a1b75', value: 'APROVADA', label: 'Aprovada', position: 2, color: 'green' },
  { id: '10cd124c-b617-45bd-8b8e-6bcafb5a5fa2', value: 'DESCARTADA', label: 'Descartada', position: 3, color: 'gray' },
  { id: '54486380-9f2e-4086-86e0-92674cf3b242', value: 'VIROU_PROJETO', label: 'Virou projeto', position: 4, color: 'purple' },
] as const;
