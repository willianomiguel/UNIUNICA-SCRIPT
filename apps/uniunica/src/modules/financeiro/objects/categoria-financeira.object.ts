import { defineObject, FieldType } from 'twenty-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { LANCAMENTO_SELECT_OPTIONS } from 'src/modules/financeiro/constants/lancamento-select-options';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineObject({
  universalIdentifier: OBJECTS.categoriaFinanceira.universalIdentifier,
  nameSingular: OBJECTS.categoriaFinanceira.nameSingular,
  namePlural: OBJECTS.categoriaFinanceira.namePlural,
  labelSingular: 'Categoria financeira',
  labelPlural: 'Categorias financeiras',
  description: 'Agrupa lançamentos e define o orçamento mensal',
  icon: 'IconCategory',
  labelIdentifierFieldMetadataUniversalIdentifier: FINANCEIRO_IDS.CATEGORIA_NOME,
  fields: [
    {
      universalIdentifier: FINANCEIRO_IDS.CATEGORIA_NOME,
      type: FieldType.TEXT,
      name: 'nome',
      label: 'Nome',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: FINANCEIRO_IDS.CATEGORIA_TIPO,
      type: FieldType.SELECT,
      name: 'tipo',
      label: 'Tipo',
      icon: 'IconArrowsExchange',
      defaultValue: "'SAIDA'",
      options: [...LANCAMENTO_SELECT_OPTIONS.tipo],
    },
    {
      universalIdentifier: FINANCEIRO_IDS.CATEGORIA_ORCAMENTO_MENSAL,
      type: FieldType.CURRENCY,
      name: 'orcamentoMensal',
      label: 'Orçamento mensal',
      description: 'Valor previsto por mês (meta de receita ou teto de gasto)',
      icon: 'IconReportMoney',
      isNullable: true,
      defaultValue: { amountMicros: null, currencyCode: "'BRL'" },
    },
    {
      universalIdentifier: FINANCEIRO_IDS.CATEGORIA_COR,
      type: FieldType.SELECT,
      name: 'cor',
      label: 'Cor',
      icon: 'IconPalette',
      isNullable: true,
      options: [...LANCAMENTO_SELECT_OPTIONS.categoriaCor],
    },
    {
      universalIdentifier: FINANCEIRO_IDS.CATEGORIA_DESCRICAO,
      type: FieldType.TEXT,
      name: 'descricao',
      label: 'Descrição',
      icon: 'IconNotes',
      isNullable: true,
    },
  ],
});
