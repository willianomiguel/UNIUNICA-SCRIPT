import { definePageLayout, PageLayoutTabLayoutMode, PageLayoutType } from 'integra-sdk/define';

import { PROJETO_FIELD_IDS, PROJETO_OBJECT_ID } from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { PROJETO_RECORD_PAGE_FIELDS_VIEW_ID } from 'src/modules/projetos/views/projeto-record-page-fields.view';

export default definePageLayout({
  universalIdentifier: '5bfc2c4f-c64b-4d5a-956f-98a6e2c96836',
  name: 'Página do registro (projeto)',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: PROJETO_OBJECT_ID,
  tabs: [
    {
      universalIdentifier: '2ffdb8a9-ffcf-4ae9-bb6f-9b9107fad4e2',
      title: 'Início',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: 'a061d318-47b1-478a-86cf-0a5bf3d2f7cf',
          title: 'Campos',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: PROJETO_RECORD_PAGE_FIELDS_VIEW_ID,
          },
        },
        {
          universalIdentifier: 'a0053ac9-336d-46e0-ad09-8d31d86b9d08',
          title: 'Descrição',
          type: 'FIELD',
          configuration: {
            configurationType: 'FIELD',
            fieldMetadataId: PROJETO_FIELD_IDS.descricao,
            fieldDisplayMode: 'EDITOR',
          },
        },
      ],
    },
    {
      universalIdentifier: '37f08bdd-4be7-4f63-9459-b688bdae5da2',
      title: 'Linha do tempo',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '2b1b82a8-d757-47fd-b7fb-1fa0febdf5cf',
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
