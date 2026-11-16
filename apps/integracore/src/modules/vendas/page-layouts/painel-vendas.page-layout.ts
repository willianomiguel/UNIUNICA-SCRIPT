import {
  AggregateOperations,
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutWidgetVerticalListHeightBehavior,
} from 'integra-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

const F = VENDAS_IDS.venda;
const OBJETO = VENDAS_IDS.objetoVenda;

const BARRAS = {
  layout: 'VERTICAL',
  primaryAxisOrderBy: 'VALUE_DESC',
  axisNameDisplay: 'NONE',
  color: 'auto',
  timezone: 'America/Sao_Paulo',
  firstDayOfTheWeek: 1,
} as const;

const posicao = (row: number, column: number, rowSpan: number, columnSpan: number) => ({
  layoutMode: PageLayoutTabLayoutMode.GRID as const,
  row,
  column,
  rowSpan,
  columnSpan,
});

export default definePageLayout({
  universalIdentifier: VENDAS_IDS.painelPageLayout,
  name: 'Painel de Vendas',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: 'bbe03722-fcbe-42db-9fe6-340277676e71',
      title: 'Resumo',
      position: 0,
      icon: 'IconLayoutDashboard',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '4f93e988-eb5c-48c5-99ac-677ab23e6a58',
          title: ' ',
          type: 'FRONT_COMPONENT',
          heightBehavior: PageLayoutWidgetVerticalListHeightBehavior.TAB_VIEWPORT,
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: VENDAS_IDS.painelFrontComponent,
          },
        },
      ],
    },
    {
      universalIdentifier: 'b3261104-c0f9-48d3-8d8f-d9718d3f20e9',
      title: 'Gráficos',
      position: 1,
      icon: 'IconChartBar',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        {
          universalIdentifier: 'e2658234-2950-471d-a0ad-e5bc43d45ee1',
          title: 'Faturamento aprovado (total)',
          type: 'GRAPH',
          objectUniversalIdentifier: OBJETO,
          position: posicao(0, 0, 2, 4),
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: F.valor,
            aggregateOperation: AggregateOperations.SUM,
            displayDataLabel: true,
            timezone: 'America/Sao_Paulo',
            firstDayOfTheWeek: 1,
            filter: {
              recordFilters: [
                { fieldMetadataUniversalIdentifier: F.status, operand: 'IS', value: '["APROVADA"]' },
              ],
            },
          },
        },
        {
          universalIdentifier: '376e773d-e802-46cb-989f-26dea6e2c8f0',
          title: 'Chargebacks (total)',
          type: 'GRAPH',
          objectUniversalIdentifier: OBJETO,
          position: posicao(0, 4, 2, 4),
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: F.valor,
            aggregateOperation: AggregateOperations.SUM,
            displayDataLabel: true,
            timezone: 'America/Sao_Paulo',
            firstDayOfTheWeek: 1,
            filter: {
              recordFilters: [
                { fieldMetadataUniversalIdentifier: F.status, operand: 'IS', value: '["CHARGEBACK"]' },
              ],
            },
          },
        },
        {
          universalIdentifier: '6e0ecf81-9438-4de8-93be-26dac498758e',
          title: 'Recusas e falhas (quantidade)',
          type: 'GRAPH',
          objectUniversalIdentifier: OBJETO,
          position: posicao(0, 8, 2, 4),
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: F.descricao,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            timezone: 'America/Sao_Paulo',
            firstDayOfTheWeek: 1,
            filter: {
              recordFilters: [
                { fieldMetadataUniversalIdentifier: F.status, operand: 'IS', value: '["RECUSADA","FALHA"]' },
              ],
            },
          },
        },
        {
          universalIdentifier: '2f9cc5e3-97d0-4bab-a59c-85732952cc59',
          title: 'Vendas por status',
          type: 'GRAPH',
          objectUniversalIdentifier: OBJETO,
          position: posicao(2, 0, 6, 6),
          configuration: {
            configurationType: 'PIE_CHART',
            aggregateFieldMetadataUniversalIdentifier: F.descricao,
            aggregateOperation: AggregateOperations.COUNT,
            groupByFieldMetadataUniversalIdentifier: F.status,
            displayLegend: true,
            timezone: 'America/Sao_Paulo',
            firstDayOfTheWeek: 1,
          },
        },
        {
          universalIdentifier: '9ecf47a0-49d4-48e7-9897-a349a46c0fcf',
          title: 'Valor por gateway',
          type: 'GRAPH',
          objectUniversalIdentifier: OBJETO,
          position: posicao(2, 6, 6, 6),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: F.valor,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: F.gateway,
            ...BARRAS,
          },
        },
        {
          universalIdentifier: '3ba1b238-528d-4750-957d-a086becf5f15',
          title: 'Valor por método de pagamento',
          type: 'GRAPH',
          objectUniversalIdentifier: OBJETO,
          position: posicao(8, 0, 6, 6),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: F.valor,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: F.metodoPagamento,
            ...BARRAS,
          },
        },
        {
          universalIdentifier: '4b283ea7-2780-45ac-bfe8-1cd5c109f29a',
          title: 'Vendas por campanha (UTM)',
          type: 'GRAPH',
          objectUniversalIdentifier: OBJETO,
          position: posicao(8, 6, 6, 6),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: F.descricao,
            aggregateOperation: AggregateOperations.COUNT,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: F.utmCampaign,
            ...BARRAS,
          },
        },
      ],
    },
  ],
});
