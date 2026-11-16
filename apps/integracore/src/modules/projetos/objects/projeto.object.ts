import { defineObject, FieldType } from 'integra-sdk/define';

import { PROJETO_AREA_OPTIONS } from 'src/modules/projetos/constants/projeto-area-options';
import { PROJETO_PRIORIDADE_OPTIONS } from 'src/modules/projetos/constants/projeto-prioridade-options';
import { PROJETO_STATUS_OPTIONS } from 'src/modules/projetos/constants/projeto-status-options';
import {
  PROJETO_FIELD_IDS,
  PROJETO_OBJECT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineObject({
  universalIdentifier: PROJETO_OBJECT_ID,
  nameSingular: OBJECTS.projeto.nameSingular,
  namePlural: OBJECTS.projeto.namePlural,
  labelSingular: 'Projeto',
  labelPlural: 'Projetos',
  description: 'Iniciativa da equipe com período, área, responsável e progresso',
  icon: 'IconRocket',
  labelIdentifierFieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.nome,
  fields: [
    {
      universalIdentifier: PROJETO_FIELD_IDS.nome,
      type: FieldType.TEXT,
      name: 'nome',
      label: 'Nome',
      description: 'Nome do projeto',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: PROJETO_FIELD_IDS.descricao,
      type: FieldType.RICH_TEXT,
      name: 'descricao',
      label: 'Descrição',
      description: 'Objetivo, escopo e contexto do projeto',
      icon: 'IconFileText',
      isNullable: true,
    },
    {
      universalIdentifier: PROJETO_FIELD_IDS.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgress',
      defaultValue: "'PLANEJADO'",
      options: [...PROJETO_STATUS_OPTIONS],
    },
    {
      universalIdentifier: PROJETO_FIELD_IDS.prioridade,
      type: FieldType.SELECT,
      name: 'prioridade',
      label: 'Prioridade',
      icon: 'IconFlag',
      defaultValue: "'MEDIA'",
      options: [...PROJETO_PRIORIDADE_OPTIONS],
    },
    {
      universalIdentifier: PROJETO_FIELD_IDS.area,
      type: FieldType.SELECT,
      name: 'area',
      label: 'Área',
      icon: 'IconCategory',
      isNullable: true,
      options: [...PROJETO_AREA_OPTIONS],
    },
    {
      universalIdentifier: PROJETO_FIELD_IDS.dataInicio,
      type: FieldType.DATE,
      name: 'dataInicio',
      label: 'Data de início',
      icon: 'IconCalendarEvent',
      isNullable: true,
    },
    {
      universalIdentifier: PROJETO_FIELD_IDS.dataFim,
      type: FieldType.DATE,
      name: 'dataFim',
      label: 'Data de fim',
      icon: 'IconCalendarDue',
      isNullable: true,
    },
    {
      universalIdentifier: PROJETO_FIELD_IDS.progresso,
      type: FieldType.NUMBER,
      name: 'progresso',
      label: 'Progresso (%)',
      description:
        'De 0 a 100. Recalculado automaticamente pelas tarefas concluídas, quando houver tarefas ligadas',
      icon: 'IconChartBar',
      defaultValue: 0,
      universalSettings: { decimals: 0 },
    },
    {
      universalIdentifier: PROJETO_FIELD_IDS.trimestre,
      type: FieldType.TEXT,
      name: 'trimestre',
      label: 'Trimestre',
      description: 'Trimestre de referência, no formato 2026-T4',
      icon: 'IconCalendarStats',
      isNullable: true,
    },
  ],
});
