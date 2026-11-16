import { definePageLayout, PageLayoutTabLayoutMode } from 'integra-sdk/define';

import { AVISOS_UNIVERSAL_IDENTIFIERS } from 'src/modules/avisos/constants/avisos-universal-identifiers';

export default definePageLayout({
  universalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.pageLayout,
  name: 'Página do alerta',
  type: 'RECORD_PAGE',
  objectUniversalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.object,
  tabs: [
    {
      universalIdentifier: 'fdebba8d-80c7-4c93-9041-829084d7cef9',
      title: 'Regra',
      position: 10,
      icon: 'IconBell',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '6950bf37-ad76-4e26-877d-9b40f21ce696',
          title: 'Campos',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.views.recordPageFields,
          },
        },
      ],
    },
    {
      universalIdentifier: '0839a58e-10cd-494a-b3c2-657128a7af6c',
      title: 'Linha do tempo',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '44e99563-3475-420b-8063-a4d9ce523713',
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
