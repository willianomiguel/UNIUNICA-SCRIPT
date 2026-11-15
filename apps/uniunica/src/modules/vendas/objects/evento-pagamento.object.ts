import { defineObject, FieldType } from 'twenty-sdk/define';

import { OBJECTS } from 'src/modules/shared/constants/objects';
import { GATEWAY_OPCOES } from 'src/modules/vendas/constants/gateway-opcoes';
import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

const F = VENDAS_IDS.eventoPagamento;

export default defineObject({
  universalIdentifier: OBJECTS.eventoPagamento.universalIdentifier,
  nameSingular: OBJECTS.eventoPagamento.nameSingular,
  namePlural: OBJECTS.eventoPagamento.namePlural,
  labelSingular: 'Evento de pagamento',
  labelPlural: 'Eventos de pagamento',
  description: 'Registro bruto de cada webhook recebido dos gateways de pagamento.',
  icon: 'IconWebhook',
  labelIdentifierFieldMetadataUniversalIdentifier: F.tipo,
  fields: [
    {
      universalIdentifier: F.tipo,
      type: FieldType.TEXT,
      name: 'tipo',
      label: 'Tipo do evento',
      description: 'Tipo de evento informado pelo gateway (ex.: payment_intent.succeeded)',
      icon: 'IconTag',
      isSearchable: true,
    },
    {
      universalIdentifier: F.gateway,
      type: FieldType.SELECT,
      name: 'gateway',
      label: 'Gateway',
      icon: 'IconBuildingBank',
      defaultValue: "'OUTRO'",
      options: GATEWAY_OPCOES,
    },
    {
      universalIdentifier: F.idExterno,
      type: FieldType.TEXT,
      name: 'idExterno',
      label: 'ID no gateway',
      description: 'Identificador da cobrança no gateway',
      icon: 'IconHash',
      isSearchable: true,
    },
    {
      universalIdentifier: F.payload,
      type: FieldType.RAW_JSON,
      name: 'payload',
      label: 'Payload',
      description: 'Corpo do webhook como recebido',
      icon: 'IconBraces',
      isNullable: true,
    },
    {
      universalIdentifier: F.recebidoEm,
      type: FieldType.DATE_TIME,
      name: 'recebidoEm',
      label: 'Recebido em',
      icon: 'IconClock',
      isNullable: true,
    },
    {
      universalIdentifier: F.processado,
      type: FieldType.BOOLEAN,
      name: 'processado',
      label: 'Processado',
      description: 'Indica se o evento atualizou uma venda',
      icon: 'IconCheck',
      defaultValue: false,
    },
    {
      universalIdentifier: F.erro,
      type: FieldType.TEXT,
      name: 'erro',
      label: 'Erro',
      description: 'Motivo de o evento não ter sido processado',
      icon: 'IconAlertCircle',
    },
  ],
});
