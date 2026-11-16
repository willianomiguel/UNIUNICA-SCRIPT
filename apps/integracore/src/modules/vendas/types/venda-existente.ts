import { type VendaStatus } from 'src/modules/vendas/types/venda-status';

export type VendaExistente = {
  id: string;
  status: VendaStatus | null;
  dataEvento: string | null;
};
