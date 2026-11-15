import { defineObject, FieldType } from 'twenty-sdk/define';

import { IDEIA_AREA_OPTIONS } from 'src/modules/projetos/constants/ideia-area-options';
import { IDEIA_STATUS_OPTIONS } from 'src/modules/projetos/constants/ideia-status-options';
import {
  IDEIA_FIELD_IDS,
  IDEIA_OBJECT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineObject({
  universalIdentifier: IDEIA_OBJECT_ID,
  nameSingular: OBJECTS.ideia.nameSingular,
  namePlural: OBJECTS.ideia.namePlural,
  labelSingular: 'Ideia',
  labelPlural: 'Ideias',
  description: 'Sugestão da equipe, votada e priorizada antes de virar projeto',
  icon: 'IconBulb',
  labelIdentifierFieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.titulo,
  fields: [
    {
      universalIdentifier: IDEIA_FIELD_IDS.titulo,
      type: FieldType.TEXT,
      name: 'titulo',
      label: 'Título',
      description: 'Resumo da ideia em uma frase',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: IDEIA_FIELD_IDS.descricao,
      type: FieldType.RICH_TEXT,
      name: 'descricao',
      label: 'Descrição',
      description: 'Problema, proposta e resultado esperado',
      icon: 'IconFileText',
      isNullable: true,
    },
    {
      universalIdentifier: IDEIA_FIELD_IDS.area,
      type: FieldType.SELECT,
      name: 'area',
      label: 'Área',
      icon: 'IconCategory',
      isNullable: true,
      options: [...IDEIA_AREA_OPTIONS],
    },
    {
      universalIdentifier: IDEIA_FIELD_IDS.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgress',
      defaultValue: "'NOVA'",
      options: [...IDEIA_STATUS_OPTIONS],
    },
    {
      universalIdentifier: IDEIA_FIELD_IDS.impacto,
      type: FieldType.NUMBER,
      name: 'impacto',
      label: 'Impacto (1–5)',
      description: '1 = pouco impacto, 5 = impacto muito alto',
      icon: 'IconTrendingUp',
      defaultValue: 3,
      universalSettings: { decimals: 0 },
    },
    {
      universalIdentifier: IDEIA_FIELD_IDS.esforco,
      type: FieldType.NUMBER,
      name: 'esforco',
      label: 'Esforço (1–5)',
      description: '1 = muito fácil, 5 = muito trabalhoso',
      icon: 'IconBarbell',
      defaultValue: 3,
      universalSettings: { decimals: 0 },
    },
    {
      universalIdentifier: IDEIA_FIELD_IDS.votos,
      type: FieldType.NUMBER,
      name: 'votos',
      label: 'Votos',
      description: 'Quantas vezes a equipe votou nesta ideia',
      icon: 'IconThumbUp',
      defaultValue: 0,
      universalSettings: { decimals: 0 },
    },
    {
      universalIdentifier: IDEIA_FIELD_IDS.pontuacao,
      type: FieldType.NUMBER,
      name: 'pontuacao',
      label: 'Pontuação',
      description:
        'Calculada automaticamente: impacto × (1 + votos) ÷ esforço, com 1 casa decimal. Não edite à mão',
      icon: 'IconStar',
      defaultValue: 0,
      universalSettings: { decimals: 1 },
    },
  ],
});
