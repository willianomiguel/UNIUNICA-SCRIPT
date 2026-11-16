import { type LinhaValor } from 'src/modules/financeiro/types/linha-valor';

export type ResumoFinanceiro = {
  inicio: string;
  fim: string;
  // Realizado = só lançamentos pagos; previsto = todos menos cancelados (pagos + pendentes + atrasados).
  receitasRealizadas: number;
  despesasRealizadas: number;
  saldoRealizado: number;
  receitasPrevistas: number;
  despesasPrevistas: number;
  saldoPrevisto: number;
  aReceberEmAberto: number;
  aPagarEmAberto: number;
  atrasadosQuantidade: number;
  atrasadosValor: number;
  atrasadosAPagar: number;
  atrasadosAReceber: number;
  topCategoriasDespesa: LinhaValor[];
  quantidadeLancamentosNoPeriodo: number;
  mensagem: string;
};
