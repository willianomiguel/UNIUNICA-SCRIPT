import { definePageLayout, PageLayoutTabLayoutMode } from 'integra-sdk/define';

import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';

const IDS = QUADROS_UNIVERSAL_IDENTIFIERS.recordPage;

export default definePageLayout({
  universalIdentifier: IDS.pageLayout,
  name: 'Página do quadro',
  type: 'RECORD_PAGE',
  objectUniversalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.object,
  // Sem isso o IntegraCore prende a 1ª aba (o editor) na coluna estreita da esquerda.
  isFirstTabPinned: false,
  tabs: [
    {
      universalIdentifier: IDS.abaQuadro,
      title: 'Quadro',
      position: 0,
      icon: 'IconPresentation',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: IDS.widgetQuadro,
          title: 'Quadro',
          type: 'FRONT_COMPONENT',
          heightBehavior: 'TAB_VIEWPORT',
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.editor.frontComponent,
          },
        },
      ],
    },
    {
      universalIdentifier: IDS.abaDetalhes,
      title: 'Detalhes',
      position: 10,
      icon: 'IconListDetails',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: IDS.widgetDetalhes,
          title: 'Campos',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.views.recordPageFields,
          },
        },
      ],
    },
    {
      universalIdentifier: IDS.abaLinhaDoTempo,
      title: 'Linha do tempo',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: IDS.widgetLinhaDoTempo,
          title: 'Linha do tempo',
          type: 'TIMELINE',
          configuration: {
            configurationType: 'TIMELINE',
          },
        },
      ],
    },
  ],
});
