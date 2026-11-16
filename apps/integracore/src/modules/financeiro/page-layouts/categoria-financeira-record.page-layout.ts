import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutType,
} from 'integra-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default definePageLayout({
  universalIdentifier: FINANCEIRO_IDS.PAGE_LAYOUT_CATEGORIA,
  name: 'Categoria financeira',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: OBJECTS.categoriaFinanceira.universalIdentifier,
  tabs: [
    {
      universalIdentifier: '0b825e93-136e-443b-8c18-99ac1d25af97',
      title: 'Início',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '2964c140-9ee0-40ec-a210-678f932e36f8',
          title: 'Campos',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: FINANCEIRO_IDS.VIEW_CATEGORIA_FIELDS,
          },
        },
      ],
    },
    {
      universalIdentifier: '0b7cdb02-2cc8-4a84-a2e8-f5332181636f',
      title: 'Histórico',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '57c181c1-fea7-4549-8a5a-325301edc30f',
          title: 'Histórico',
          type: 'TIMELINE',
          configuration: {
            configurationType: 'TIMELINE',
          },
        },
      ],
    },
  ],
});
