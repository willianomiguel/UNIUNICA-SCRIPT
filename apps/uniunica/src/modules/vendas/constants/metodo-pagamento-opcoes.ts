import { type MetodoPagamento } from 'src/modules/vendas/types/metodo-pagamento';
import { type OpcaoSelect } from 'src/modules/vendas/types/opcao-select';

export const METODO_PAGAMENTO_OPCOES: OpcaoSelect<MetodoPagamento>[] = [
  { value: 'PIX', label: 'Pix', color: 'turquoise', position: 0 },
  { value: 'CARTAO_CREDITO', label: 'Cartão de crédito', color: 'blue', position: 1 },
  { value: 'BOLETO', label: 'Boleto', color: 'orange', position: 2 },
  { value: 'OUTRO', label: 'Outro', color: 'gray', position: 3 },
];
