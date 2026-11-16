import { defineObject, FieldType } from 'integra-sdk/define';

import { OBJECTS } from 'src/modules/shared/constants/objects';
import { SPRINT_STATUS_OPTIONS } from 'src/modules/sprints/constants/sprint-status-options';
import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

const F = SPRINTS_IDS.sprintFields;

export default defineObject({
  universalIdentifier: OBJECTS.sprint.universalIdentifier,
  nameSingular: OBJECTS.sprint.nameSingular,
  namePlural: OBJECTS.sprint.namePlural,
  labelSingular: 'Sprint',
  labelPlural: 'Sprints',
  description: 'Ciclo de desenvolvimento com tarefas, pontos e burndown',
  icon: 'IconRun',
  labelIdentifierFieldMetadataUniversalIdentifier: F.nome,
  fields: [
    {
      universalIdentifier: F.nome,
      type: FieldType.TEXT,
      name: 'nome',
      label: 'Nome',
      description: 'Nome da sprint (ex.: Sprint 12)',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: F.objetivo,
      type: FieldType.TEXT,
      name: 'objetivo',
      label: 'Objetivo',
      description: 'O que a sprint precisa entregar',
      icon: 'IconTarget',
      isNullable: true,
    },
    {
      universalIdentifier: F.dataInicio,
      type: FieldType.DATE,
      name: 'dataInicio',
      label: 'Data de início',
      icon: 'IconCalendarEvent',
      isNullable: true,
    },
    {
      universalIdentifier: F.dataFim,
      type: FieldType.DATE,
      name: 'dataFim',
      label: 'Data de fim',
      icon: 'IconCalendarDue',
      isNullable: true,
    },
    {
      universalIdentifier: F.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      defaultValue: "'PLANEJADA'",
      options: SPRINT_STATUS_OPTIONS,
    },
    {
      universalIdentifier: F.capacidadePontos,
      type: FieldType.NUMBER,
      name: 'capacidadePontos',
      label: 'Capacidade (pontos)',
      description: 'Quantos pontos o time consegue entregar na sprint',
      icon: 'IconGauge',
      isNullable: true,
    },
    {
      universalIdentifier: F.pontosTotais,
      type: FieldType.NUMBER,
      name: 'pontosTotais',
      label: 'Pontos totais',
      description: 'Soma dos pontos das tarefas (calculado automaticamente)',
      icon: 'IconSum',
      isNullable: true,
      defaultValue: 0,
    },
    {
      universalIdentifier: F.pontosConcluidos,
      type: FieldType.NUMBER,
      name: 'pontosConcluidos',
      label: 'Pontos concluídos',
      description:
        'Soma dos pontos das tarefas concluídas (calculado automaticamente)',
      icon: 'IconCircleCheck',
      isNullable: true,
      defaultValue: 0,
    },
    {
      universalIdentifier: F.historicoBurndown,
      type: FieldType.RAW_JSON,
      name: 'historicoBurndown',
      label: 'Histórico do burndown',
      description:
        'Fotos diárias dos pontos restantes: [{ data, pontosRestantes, pontosTotais }]',
      icon: 'IconChartLine',
      isNullable: true,
    },
    {
      universalIdentifier: F.precisaEncerrar,
      type: FieldType.BOOLEAN,
      name: 'precisaEncerrar',
      label: 'Precisa encerrar',
      description:
        'Marcado automaticamente quando uma sprint ativa passa da data de fim',
      icon: 'IconAlertTriangle',
      defaultValue: false,
    },
  ],
});
