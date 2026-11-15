import { type DadosVendaRegistro } from 'src/modules/vendas/types/dados-venda-registro';
import { type VendaNormalizada } from 'src/modules/vendas/types/venda-normalizada';
import { reaisParaMicros } from 'src/modules/vendas/utils/reais-para-micros.util';

const moeda = (valor: number | null | undefined, codigo: string) =>
  valor === null || valor === undefined
    ? undefined
    : { amountMicros: reaisParaMicros(valor), currencyCode: codigo };

// Only fields the event actually carries are returned, so updates never blank existing data.
export const montarDadosVenda = (venda: VendaNormalizada): DadosVendaRegistro => {
  const codigoMoeda = (venda.moeda ?? 'BRL').toUpperCase();
  const dados: DadosVendaRegistro = {
    gateway: venda.gateway,
    idExterno: venda.idExterno,
    status: venda.status,
    valor: moeda(venda.valor, codigoMoeda),
    valorLiquido: moeda(venda.valorLiquido, codigoMoeda),
    taxaGateway: moeda(venda.taxaGateway, codigoMoeda),
    descricao: venda.descricao ?? undefined,
    metodoPagamento: venda.metodoPagamento ?? undefined,
    parcelas: venda.parcelas ?? undefined,
    clienteNome: venda.clienteNome ?? undefined,
    clienteEmail: venda.clienteEmail
      ? { primaryEmail: venda.clienteEmail.toLowerCase(), additionalEmails: null }
      : undefined,
    dataEvento: venda.dataEvento ?? undefined,
    motivoRecusa: venda.motivoRecusa ?? undefined,
    utmSource: venda.utmSource ?? undefined,
    utmMedium: venda.utmMedium ?? undefined,
    utmCampaign: venda.utmCampaign ?? undefined,
  };

  return Object.fromEntries(
    Object.entries(dados).filter(([, valor]) => valor !== undefined),
  ) as DadosVendaRegistro;
};
