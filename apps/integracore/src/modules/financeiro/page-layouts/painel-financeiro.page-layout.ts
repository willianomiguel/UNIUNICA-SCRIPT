import {
  AggregateOperations,
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutWidgetVerticalListHeightBehavior,
} from 'integra-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const LANCAMENTO = OBJECTS.lancamento.universalIdentifier;

const COMUM = { timezone: 'America/Sao_Paulo', firstDayOfTheWeek: 1 } as const;

const filtro = (
  filtros: Array<{ campo: string; operand: string; value: string }>,
) => ({
  recordFilters: filtros.map(({ campo, operand, value }) => ({
    fieldMetadataUniversalIdentifier: campo,
    operand,
    value,
  })),
});

const ESTE_MES = {
  campo: FINANCEIRO_IDS.LANCAMENTO_DATA,
  operand: 'IS_RELATIVE',
  value: 'THIS_1_MONTH',
};
const NAO_CANCELADO = {
  campo: FINANCEIRO_IDS.LANCAMENTO_STATUS,
  operand: 'IS_NOT',
  value: '["CANCELADO"]',
};
const tipo = (valor: 'ENTRADA' | 'SAIDA') => ({
  campo: FINANCEIRO_IDS.LANCAMENTO_TIPO,
  operand: 'IS',
  value: `["${valor}"]`,
});

const posicao = (row: number, column: number, rowSpan: number, columnSpan: number) => ({
  layoutMode: PageLayoutTabLayoutMode.GRID as const,
  row,
  column,
  rowSpan,
  columnSpan,
});

export default definePageLayout({
  universalIdentifier: FINANCEIRO_IDS.PAGE_LAYOUT_PAINEL,
  name: 'Painel Financeiro',
  type: 'STANDALONE_PAGE',
  tabs: [
    // Resumo: um painel só (indicadores em R$, fluxo de caixa, DRE e orçado x realizado),
    // no mesmo formato dos painéis de Vendas e Tráfego.
    {
      universalIdentifier: 'f4d1be66-7d5e-4442-bcca-f781bf55b142',
      title: 'Resumo',
      position: 0,
      icon: 'IconLayoutDashboard',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: 'dc10f111-da99-4db4-a69f-1ec06fdaf216',
          title: ' ',
          type: 'FRONT_COMPONENT',
          heightBehavior: PageLayoutWidgetVerticalListHeightBehavior.TAB_VIEWPORT,
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: FINANCEIRO_IDS.FRONT_PAINEL,
          },
        },
      ],
    },
    {
      universalIdentifier: 'dadbe39c-08ef-45f2-88bb-3497fa5bcbb2',
      title: 'Gráficos',
      position: 1,
      icon: 'IconChartBar',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        {
          universalIdentifier: '6f0c6f9f-4a17-43d5-82ae-9a095a507e63',
          title: 'Entradas x saídas por mês',
          type: 'GRAPH',
          objectUniversalIdentifier: LANCAMENTO,
          position: posicao(0, 0, 6, 8),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VALOR,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DATA,
            primaryAxisDateGranularity: 'MONTH',
            primaryAxisOrderBy: 'FIELD_ASC',
            secondaryAxisGroupByFieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_TIPO,
            layout: 'VERTICAL',
            groupMode: 'GROUPED',
            axisNameDisplay: 'NONE',
            displayLegend: true,
            omitNullValues: true,
            color: 'auto',
            filter: filtro([NAO_CANCELADO]),
            ...COMUM,
          },
        },
        {
          universalIdentifier: '42f48ee2-170a-4ed1-8119-e661a67c8f7a',
          title: 'Saídas do mês por categoria',
          type: 'GRAPH',
          objectUniversalIdentifier: LANCAMENTO,
          position: posicao(0, 8, 6, 4),
          configuration: {
            configurationType: 'PIE_CHART',
            aggregateFieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VALOR,
            aggregateOperation: AggregateOperations.SUM,
            groupByFieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CATEGORIA,
            displayLegend: true,
            filter: filtro([ESTE_MES, NAO_CANCELADO, tipo('SAIDA')]),
            ...COMUM,
          },
        },
      ],
    },
  ],
});
