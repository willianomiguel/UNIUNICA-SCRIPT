import { type VendaNormalizada } from 'src/modules/vendas/types/venda-normalizada';

export type ResultadoNormalizacao =
  | { tipo: 'VENDA'; tipoEvento: string; venda: VendaNormalizada }
  | {
      tipo: 'IGNORADO';
      tipoEvento: string;
      idExterno: string | null;
      motivo: string;
    };
