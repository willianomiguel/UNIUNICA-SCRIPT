import { type GatewayPagamento } from 'src/modules/vendas/types/gateway-pagamento';
import { type MetodoPagamento } from 'src/modules/vendas/types/metodo-pagamento';
import { type VendaNormalizada } from 'src/modules/vendas/types/venda-normalizada';
import { type VendaStatus } from 'src/modules/vendas/types/venda-status';

type Exemplo = [
  diasAtras: number,
  status: VendaStatus,
  gateway: GatewayPagamento,
  metodo: MetodoPagamento,
  valor: number,
  produto: string,
  cliente: string,
  motivo?: string,
];

const EXEMPLOS: Exemplo[] = [
  [0, 'APROVADA', 'STRIPE', 'CARTAO_CREDITO', 497, 'Mentoria em grupo', 'Ana Souza'],
  [0, 'RECUSADA', 'STRIPE', 'CARTAO_CREDITO', 497, 'Mentoria em grupo', 'Bruno Lima', 'Saldo insuficiente'],
  [1, 'APROVADA', 'MERCADO_PAGO', 'PIX', 197, 'Curso online', 'Carla Mendes'],
  [2, 'PENDENTE', 'ASAAS', 'BOLETO', 197, 'Curso online', 'Diego Rocha'],
  [3, 'APROVADA', 'PAGARME', 'CARTAO_CREDITO', 997, 'Imersão presencial', 'Elisa Martins'],
  [5, 'FALHA', 'PAGARME', 'CARTAO_CREDITO', 997, 'Imersão presencial', 'Fábio Costa', 'Erro de comunicação com o emissor'],
  [8, 'REEMBOLSADA', 'MERCADO_PAGO', 'PIX', 197, 'Curso online', 'Gabriela Alves', 'Reembolso total'],
  [12, 'APROVADA', 'ASAAS', 'PIX', 297, 'Comunidade anual', 'Henrique Dias'],
  [18, 'CHARGEBACK', 'STRIPE', 'CARTAO_CREDITO', 497, 'Mentoria em grupo', 'Igor Pereira', 'Chargeback: fraudulent'],
  [25, 'APROVADA', 'STRIPE', 'CARTAO_CREDITO', 1497, 'Consultoria individual', 'Juliana Ramos'],
];

// Clearly labelled example sales, keyed by fixed ids so re-running the seed never duplicates them.
export const montarVendasExemplo = (agora: Date): VendaNormalizada[] =>
  EXEMPLOS.map(([diasAtras, status, gateway, metodo, valor, produto, cliente, motivo], indice) => {
    const taxa = status === 'APROVADA' || status === 'REEMBOLSADA' || status === 'CHARGEBACK'
      ? Math.round(valor * 0.0499 * 100) / 100
      : null;

    return {
      gateway,
      idExterno: `exemplo-${String(indice + 1).padStart(3, '0')}`,
      status,
      moeda: 'BRL',
      valor,
      taxaGateway: taxa,
      valorLiquido: taxa === null ? null : Math.round((valor - taxa) * 100) / 100,
      descricao: `[Exemplo] ${produto}`,
      metodoPagamento: metodo,
      parcelas: metodo === 'CARTAO_CREDITO' ? (valor > 900 ? 6 : 1) : 1,
      clienteNome: cliente,
      clienteEmail: `${cliente.split(' ')[0].normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()}@exemplo.com`,
      dataEvento: new Date(agora.getTime() - diasAtras * 24 * 60 * 60 * 1000 - indice * 37 * 60 * 1000).toISOString(),
      motivoRecusa: motivo ?? null,
      utmSource: indice % 2 === 0 ? 'instagram' : 'google',
      utmMedium: indice % 2 === 0 ? 'social' : 'cpc',
      utmCampaign: 'exemplo',
    };
  });
