import { type VendaStatus } from 'src/modules/vendas/types/venda-status';

export type ResultadoProcessamento = {
  ok: boolean;
  eventoId: string | null;
  vendaId: string | null;
  status: VendaStatus | null;
  criada: boolean;
  ignorado: boolean;
  mensagem: string | null;
};
