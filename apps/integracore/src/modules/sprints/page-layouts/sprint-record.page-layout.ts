import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutType,
} from 'integra-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

const P = SPRINTS_IDS.pageLayouts;

export default definePageLayout({
  universalIdentifier: P.sprintRecord,
  name: 'Página da sprint',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: SPRINTS_IDS.objects.sprint,
  tabs: [
    {
      universalIdentifier: P.sprintRecordTabResumo,
      title: 'Dados',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: P.sprintRecordWidgetFields,
          title: 'Dados da sprint',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: SPRINTS_IDS.views.sprintRecordPageFields,
          },
        },
      ],
    },
    {
      universalIdentifier: P.sprintRecordTabBurndown,
      title: 'Burndown e tarefas',
      position: 15,
      icon: 'IconChartLine',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: P.sprintRecordWidgetBurndown,
          title: 'Burndown',
          type: 'FRONT_COMPONENT',
          objectUniversalIdentifier: SPRINTS_IDS.objects.sprint,
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier:
              SPRINTS_IDS.frontComponents.burndown,
          },
        },
        {
          universalIdentifier: P.sprintRecordWidgetTarefas,
          title: 'Tarefas',
          type: 'FIELD',
          configuration: {
            configurationType: 'FIELD',
            fieldMetadataId: SPRINTS_IDS.sprintFields.tarefas,
            fieldDisplayMode: 'CARD',
          },
        },
      ],
    },
    {
      universalIdentifier: P.sprintRecordTabTimeline,
      title: 'Linha do tempo',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: P.sprintRecordWidgetTimeline,
          title: 'Linha do tempo',
          type: 'TIMELINE',
          configuration: { configurationType: 'TIMELINE' },
        },
      ],
    },
  ],
});
