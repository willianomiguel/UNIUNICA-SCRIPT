import { type ResultadoNormalizacao } from 'src/modules/vendas/types/resultado-normalizacao';
import { lerDataIso } from 'src/modules/vendas/utils/ler-data-iso.util';
import { lerNumero } from 'src/modules/vendas/utils/ler-numero.util';
import { lerObjeto } from 'src/modules/vendas/utils/ler-objeto.util';
import { lerTexto } from 'src/modules/vendas/utils/ler-texto.util';
import { normalizarGateway } from 'src/modules/vendas/utils/normalizar-gateway.util';
import { normalizarMetodoPagamento } from 'src/modules/vendas/utils/normalizar-metodo-pagamento.util';
import { normalizarStatusGenerico } from 'src/modules/vendas/utils/normalizar-status-generico.util';

// Generic JSON format documented in the module README (amounts in reais).
export const normalizarWebhookGenerico = (
  corpo: unknown,
): ResultadoNormalizacao => {
  const dados = lerObjeto(corpo);
  const utm = lerObjeto(dados, 'utm');
  const idExterno = lerTexto(dados.idExterno) ?? lerTexto(dados.id);
  const statusInformado = lerTexto(dados.status);
  const status = normalizarStatusGenerico(statusInformado);
  const tipoEvento = lerTexto(dados.tipo) ?? `venda.${(statusInformado ?? 'sem_status').toLowerCase()}`;

  if (idExterno === null) {
    return { tipo: 'IGNORADO', tipoEvento, idExterno: null, motivo: 'Campo "idExterno" é obrigatório' };
  }

  if (status === null) {
    return {
      tipo: 'IGNORADO',
      tipoEvento,
      idExterno,
      motivo: `Status inválido: "${statusInformado ?? ''}". Use APROVADA, PENDENTE, RECUSADA, FALHA, REEMBOLSADA, CHARGEBACK ou CANCELADA`,
    };
  }

  const parcelas = lerNumero(dados.parcelas);

  return {
    tipo: 'VENDA',
    tipoEvento,
    venda: {
      gateway: normalizarGateway(lerTexto(dados.gateway), 'OUTRO'),
      idExterno,
      status,
      forcarStatus: dados.forcarStatus === true,
      moeda: lerTexto(dados.moeda),
      valor: lerNumero(dados.valor),
      valorLiquido: lerNumero(dados.valorLiquido),
      taxaGateway: lerNumero(dados.taxaGateway),
      descricao: lerTexto(dados.descricao) ?? lerTexto(dados.produto),
      metodoPagamento: normalizarMetodoPagamento(lerTexto(dados.metodoPagamento)),
      parcelas: parcelas === null ? null : Math.round(parcelas),
      clienteNome: lerTexto(dados.clienteNome),
      clienteEmail: lerTexto(dados.clienteEmail),
      dataEvento: lerDataIso(dados.dataEvento),
      motivoRecusa: lerTexto(dados.motivoRecusa),
      utmSource: lerTexto(dados.utmSource) ?? lerTexto(utm.source),
      utmMedium: lerTexto(dados.utmMedium) ?? lerTexto(utm.medium),
      utmCampaign: lerTexto(dados.utmCampaign) ?? lerTexto(utm.campaign),
    },
  };
};
