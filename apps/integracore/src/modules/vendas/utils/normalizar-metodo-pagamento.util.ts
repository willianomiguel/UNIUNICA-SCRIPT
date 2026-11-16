import { type MetodoPagamento } from 'src/modules/vendas/types/metodo-pagamento';

const MAPA: Record<string, MetodoPagamento> = {
  pix: 'PIX',
  bank_transfer: 'PIX',
  credit_card: 'CARTAO_CREDITO',
  cartao_credito: 'CARTAO_CREDITO',
  cartao: 'CARTAO_CREDITO',
  card: 'CARTAO_CREDITO',
  creditcard: 'CARTAO_CREDITO',
  boleto: 'BOLETO',
  ticket: 'BOLETO',
  bank_slip: 'BOLETO',
};

export const normalizarMetodoPagamento = (
  valor: string | null | undefined,
): MetodoPagamento | null => {
  if (valor === null || valor === undefined || valor.trim() === '') {
    return null;
  }

  return MAPA[valor.trim().toLowerCase().replace(/[\s-]/g, '_')] ?? 'OUTRO';
};
