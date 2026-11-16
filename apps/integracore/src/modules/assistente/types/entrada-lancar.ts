export type EntradaLancar = {
  descricao: string;
  // Valor em centavos inteiros (nunca float acumulado).
  valorCentavos: number;
  tipo: 'ENTRADA' | 'SAIDA';
  categoria: string | null;
  data: string;
  vencimento: string | null;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
  formaPagamento: string | null;
  observacoes: string | null;
};
