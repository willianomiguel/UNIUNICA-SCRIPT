import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';

export default definePageLayout({
  universalIdentifier: '3663b1b0-873d-46df-b20e-202e8757f60c',
  name: 'Página do documento',
  type: 'RECORD_PAGE',
  objectUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
  tabs: [
    {
      universalIdentifier: 'c197359e-a941-42e0-8724-1dac56c4d737',
      title: 'Conteúdo',
      position: 0,
      icon: 'IconFileText',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        {
          universalIdentifier: '7675561e-278d-4b05-8064-04cd5b45cd62',
          title: 'Conteúdo',
          type: 'FIELD',
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 0,
            rowSpan: 12,
            columnSpan: 12,
          },
          configuration: {
            configurationType: 'FIELD',
            fieldMetadataId: DOCS_UNIVERSAL_IDENTIFIERS.fields.conteudo,
            fieldDisplayMode: 'EDITOR',
          },
        },
      ],
    },
    {
      universalIdentifier: '4ea39596-79bb-4a77-998a-096a957d0f1c',
      title: 'Detalhes',
      position: 10,
      icon: 'IconListDetails',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '11302747-c6db-4588-9c04-2614f29d97ed',
          title: 'Campos',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.views.recordPageFields,
          },
        },
      ],
    },
    {
      universalIdentifier: 'b46e41a7-d21c-4a6b-976d-97fb39886edc',
      title: 'Linha do tempo',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: 'b74b51d7-c49f-428a-a1a5-45ecd3f15d4e',
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
