import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'twenty-sdk/define';

import { IDEIA_FIELD_IDS, IDEIA_OBJECT_ID } from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { IDEIA_RECORD_PAGE_FIELDS_VIEW_ID } from 'src/modules/projetos/views/ideia-record-page-fields.view';

export default definePageLayout({
  universalIdentifier: 'eeac452c-a732-4e72-8458-904c73160788',
  name: 'Página do registro (ideia)',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: IDEIA_OBJECT_ID,
  tabs: [
    {
      universalIdentifier: '469b3a0f-0dcc-42a2-b3a3-8d59711d5a74',
      title: 'Início',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '408a8fd4-34a6-46b9-bde0-dfd80a6a600d',
          title: 'Campos',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: IDEIA_RECORD_PAGE_FIELDS_VIEW_ID,
          },
        },
        {
          universalIdentifier: 'b2d37725-b1c6-4529-a5aa-9db87abe4367',
          title: 'Descrição',
          type: 'FIELD',
          configuration: {
            configurationType: 'FIELD',
            fieldMetadataId: IDEIA_FIELD_IDS.descricao,
            fieldDisplayMode: 'EDITOR',
          },
        },
      ],
    },
    {
      universalIdentifier: '21338010-9d23-4b6b-9ae9-a97e69e41883',
      title: 'Linha do tempo',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '7ef2a465-da81-45e1-8fe5-1a34a041d71a',
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
