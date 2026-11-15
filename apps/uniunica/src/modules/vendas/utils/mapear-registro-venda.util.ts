import { GATEWAY_OPCOES } from 'src/modules/vendas/constants/gateway-opcoes';
import { METODO_PAGAMENTO_OPCOES } from 'src/modules/vendas/constants/metodo-pagamento-opcoes';
import { VENDA_STATUS_OPCOES } from 'src/modules/vendas/constants/venda-status-opcoes';
import { type GatewayPagamento } from 'src/modules/vendas/types/gateway-pagamento';
import { type MetodoPagamento } from 'src/modules/vendas/types/metodo-pagamento';
import { type RegistroVendaApi } from 'src/modules/vendas/types/registro-venda-api';
import { type VendaParaMetricas } from 'src/modules/vendas/types/venda-para-metricas';
import { type VendaStatus } from 'src/modules/vendas/types/venda-status';
import { microsParaReais } from 'src/modules/vendas/utils/micros-para-reais.util';

const valorValido = <TValor extends string>(
  valor: string | null | undefined,
  opcoes: { value: TValor }[],
): TValor | null => opcoes.find((opcao) => opcao.value === valor)?.value ?? null;

export const mapearRegistroVenda = (registro: RegistroVendaApi): VendaParaMetricas => ({
  status: valorValido<VendaStatus>(registro.status, VENDA_STATUS_OPCOES),
  gateway: valorValido<GatewayPagamento>(registro.gateway, GATEWAY_OPCOES),
  metodoPagamento: valorValido<MetodoPagamento>(registro.metodoPagamento, METODO_PAGAMENTO_OPCOES),
  valor: microsParaReais(registro.valor?.amountMicros) ?? 0,
  valorLiquido: microsParaReais(registro.valorLiquido?.amountMicros),
  taxaGateway: microsParaReais(registro.taxaGateway?.amountMicros),
  dataEvento: registro.dataEvento ?? null,
});
