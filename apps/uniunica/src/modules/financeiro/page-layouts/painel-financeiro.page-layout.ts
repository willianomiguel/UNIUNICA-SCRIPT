import {
  AggregateOperations,
  definePageLayout,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';

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
const EM_ABERTO = {
  campo: FINANCEIRO_IDS.LANCAMENTO_STATUS,
  operand: 'IS',
  value: '["PENDENTE","ATRASADO"]',
};

const posicao = (row: number, column: number, rowSpan: number, columnSpan: number) => ({
  layoutMode: PageLayoutTabLayoutMode.GRID as const,
  row,
  column,
  rowSpan,
  columnSpan,
});

const totalDoValor = (
  universalIdentifier: string,
  title: string,
  filtros: Array<{ campo: string; operand: string; value: string }>,
  column: number,
) => ({
  universalIdentifier,
  title,
  type: 'GRAPH' as const,
  objectUniversalIdentifier: LANCAMENTO,
  position: posicao(0, column, 2, 3),
  configuration: {
    configurationType: 'AGGREGATE_CHART' as const,
    aggregateFieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VALOR,
    aggregateOperation: AggregateOperations.SUM,
    displayDataLabel: true,
    filter: filtro(filtros),
    ...COMUM,
  },
});

export default definePageLayout({
  universalIdentifier: FINANCEIRO_IDS.PAGE_LAYOUT_PAINEL,
  name: 'Painel Financeiro',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: 'f4d1be66-7d5e-4442-bcca-f781bf55b142',
      title: 'Visão geral',
      position: 0,
      icon: 'IconChartBar',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        totalDoValor('1630153d-04bc-4657-8cbd-7044df9ce931', 'Entradas no mês', [ESTE_MES, NAO_CANCELADO, tipo('ENTRADA')], 0),
        totalDoValor('d8480457-db82-414f-b0f6-24c6995eb6c9', 'Saídas no mês', [ESTE_MES, NAO_CANCELADO, tipo('SAIDA')], 3),
        totalDoValor('fe1cb200-b152-43aa-81d9-f77772b39b3e', 'A pagar (em aberto)', [EM_ABERTO, tipo('SAIDA')], 6),
        totalDoValor('2d3a91b7-2aad-4ed3-91a9-a8bc2025e991', 'A receber (em aberto)', [EM_ABERTO, tipo('ENTRADA')], 9),
        {
          universalIdentifier: '6f0c6f9f-4a17-43d5-82ae-9a095a507e63',
          title: 'Entradas x saídas por mês',
          type: 'GRAPH',
          objectUniversalIdentifier: LANCAMENTO,
          position: posicao(2, 0, 6, 8),
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
          position: posicao(2, 8, 6, 4),
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
        {
          universalIdentifier: 'dc10f111-da99-4db4-a69f-1ec06fdaf216',
          title: 'Fluxo de caixa, DRE e orçado x realizado',
          type: 'FRONT_COMPONENT',
          position: posicao(8, 0, 18, 12),
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: FINANCEIRO_IDS.FRONT_PAINEL,
          },
        },
      ],
    },
  ],
});
