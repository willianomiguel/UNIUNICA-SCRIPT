import { type OpcaoSelect } from 'src/modules/vendas/types/opcao-select';
import { type VendaStatus } from 'src/modules/vendas/types/venda-status';

export const VENDA_STATUS_OPCOES: OpcaoSelect<VendaStatus>[] = [
  { value: 'APROVADA', label: 'Aprovada', color: 'green', position: 0 },
  { value: 'PENDENTE', label: 'Pendente', color: 'yellow', position: 1 },
  { value: 'RECUSADA', label: 'Recusada', color: 'orange', position: 2 },
  { value: 'FALHA', label: 'Falha', color: 'red', position: 3 },
  { value: 'REEMBOLSADA', label: 'Reembolsada', color: 'purple', position: 4 },
  { value: 'CHARGEBACK', label: 'Chargeback', color: 'pink', position: 5 },
  { value: 'CANCELADA', label: 'Cancelada', color: 'gray', position: 6 },
];
