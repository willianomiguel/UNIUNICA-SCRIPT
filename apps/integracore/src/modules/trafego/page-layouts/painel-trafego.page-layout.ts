import {
  AggregateOperations,
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutWidgetVerticalListHeightBehavior,
} from 'integra-sdk/define';

import {
  CAMPANHA_ON_METRICA_FIELD_ID,
  METRICA_CLIQUES_FIELD_ID,
  METRICA_DATA_FIELD_ID,
  METRICA_GASTO_FIELD_ID,
  METRICA_LEADS_FIELD_ID,
  METRICA_ORIGEM_FIELD_ID,
  METRICA_TRAFEGO_OBJECT_ID,
  METRICA_VISITAS_FIELD_ID,
  PAINEL_TRAFEGO_FRONT_COMPONENT_ID,
  PAINEL_TRAFEGO_PAGE_LAYOUT_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

const BASE = { timezone: 'America/Sao_Paulo', firstDayOfTheWeek: 1 } as const;

const BARRAS = {
  ...BASE,
  layout: 'VERTICAL',
  axisNameDisplay: 'NONE',
  color: 'auto',
} as const;

const posicao = (row: number, column: number, rowSpan: number, columnSpan: number) => ({
  layoutMode: PageLayoutTabLayoutMode.GRID as const,
  row,
  column,
  rowSpan,
  columnSpan,
});

const total = (
  universalIdentifier: string,
  title: string,
  campo: string,
  column: number,
) => ({
  universalIdentifier,
  title,
  type: 'GRAPH' as const,
  objectUniversalIdentifier: METRICA_TRAFEGO_OBJECT_ID,
  position: posicao(0, column, 2, 3),
  configuration: {
    configurationType: 'AGGREGATE_CHART' as const,
    aggregateFieldMetadataUniversalIdentifier: campo,
    aggregateOperation: AggregateOperations.SUM,
    displayDataLabel: true,
    ...BASE,
  },
});

export default definePageLayout({
  universalIdentifier: PAINEL_TRAFEGO_PAGE_LAYOUT_ID,
  name: 'Painel de Tráfego',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: 'a1840452-b3e4-4c95-bbf9-9f284f12c4f2',
      title: 'Resumo',
      position: 0,
      icon: 'IconChartBar',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '0f781318-b616-464b-948f-7994eb515662',
          title: ' ',
          type: 'FRONT_COMPONENT',
          heightBehavior: PageLayoutWidgetVerticalListHeightBehavior.TAB_VIEWPORT,
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: PAINEL_TRAFEGO_FRONT_COMPONENT_ID,
          },
        },
      ],
    },
    {
      universalIdentifier: 'ec9f0208-aa5e-41c6-baea-2a25da018b48',
      title: 'Gráficos',
      position: 1,
      icon: 'IconChartLine',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        total('100a96ce-3113-4eed-81a8-1d315712dda5', 'Gasto total', METRICA_GASTO_FIELD_ID, 0),
        total('fcb9a5dd-7193-4ca6-81d6-16c5f62e6415', 'Cliques', METRICA_CLIQUES_FIELD_ID, 3),
        total('573bd0a8-a8f9-44d7-b6a9-2ad85e19dc2b', 'Visitas', METRICA_VISITAS_FIELD_ID, 6),
        total('c9bd14a8-4a0d-4792-8bd6-448ba8e1c28e', 'Leads', METRICA_LEADS_FIELD_ID, 9),
        {
          universalIdentifier: '8af96246-01ab-42c3-b153-05607c79bc69',
          title: 'Gasto por dia',
          type: 'GRAPH',
          objectUniversalIdentifier: METRICA_TRAFEGO_OBJECT_ID,
          position: posicao(2, 0, 6, 12),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: METRICA_GASTO_FIELD_ID,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: METRICA_DATA_FIELD_ID,
            primaryAxisDateGranularity: 'DAY',
            primaryAxisOrderBy: 'FIELD_ASC',
            secondaryAxisGroupByFieldMetadataUniversalIdentifier: CAMPANHA_ON_METRICA_FIELD_ID,
            ...BARRAS,
          },
        },
        {
          universalIdentifier: 'ec54ac57-e002-4288-a160-0199d6c2c442',
          title: 'Gasto por campanha',
          type: 'GRAPH',
          objectUniversalIdentifier: METRICA_TRAFEGO_OBJECT_ID,
          position: posicao(8, 0, 6, 6),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: METRICA_GASTO_FIELD_ID,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: CAMPANHA_ON_METRICA_FIELD_ID,
            ...BARRAS,
            primaryAxisOrderBy: 'VALUE_DESC',
          },
        },
        {
          universalIdentifier: '87c71b62-3e36-4915-977c-7f86674449ee',
          title: 'Leads por campanha',
          type: 'GRAPH',
          objectUniversalIdentifier: METRICA_TRAFEGO_OBJECT_ID,
          position: posicao(8, 6, 6, 6),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: METRICA_LEADS_FIELD_ID,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: CAMPANHA_ON_METRICA_FIELD_ID,
            ...BARRAS,
            primaryAxisOrderBy: 'VALUE_DESC',
          },
        },
        {
          universalIdentifier: 'ffcb6eee-a1ce-4f98-ae11-3596176fb145',
          title: 'Cliques por dia',
          type: 'GRAPH',
          objectUniversalIdentifier: METRICA_TRAFEGO_OBJECT_ID,
          position: posicao(14, 0, 6, 8),
          configuration: {
            configurationType: 'LINE_CHART',
            aggregateFieldMetadataUniversalIdentifier: METRICA_CLIQUES_FIELD_ID,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: METRICA_DATA_FIELD_ID,
            primaryAxisDateGranularity: 'DAY',
            primaryAxisOrderBy: 'FIELD_ASC',
            axisNameDisplay: 'NONE',
            color: 'auto',
            ...BASE,
          },
        },
        {
          universalIdentifier: '07d19f5e-a636-414b-92a1-59d5f8315cf1',
          title: 'Gasto por origem',
          type: 'GRAPH',
          objectUniversalIdentifier: METRICA_TRAFEGO_OBJECT_ID,
          position: posicao(14, 8, 6, 4),
          configuration: {
            configurationType: 'PIE_CHART',
            aggregateFieldMetadataUniversalIdentifier: METRICA_GASTO_FIELD_ID,
            aggregateOperation: AggregateOperations.SUM,
            groupByFieldMetadataUniversalIdentifier: METRICA_ORIGEM_FIELD_ID,
            displayLegend: true,
            ...BASE,
          },
        },
      ],
    },
  ],
});
