// Ordem de exibição das categorias na wiki e no Kanban.
export const DOCUMENTO_CATEGORIAS: ReadonlyArray<{
  value: string;
  label: string;
  color: 'purple' | 'blue' | 'turquoise' | 'pink' | 'green' | 'orange' | 'gray';
}> = [
  { value: 'ESTRATEGIA', label: 'Estratégia', color: 'purple' },
  { value: 'PROCESSO', label: 'Processo', color: 'blue' },
  { value: 'TECNICO', label: 'Técnico', color: 'turquoise' },
  { value: 'MARKETING', label: 'Marketing', color: 'pink' },
  { value: 'FINANCEIRO', label: 'Financeiro', color: 'green' },
  { value: 'ATA_REUNIAO', label: 'Ata de reunião', color: 'orange' },
  { value: 'OUTRO', label: 'Outro', color: 'gray' },
];
