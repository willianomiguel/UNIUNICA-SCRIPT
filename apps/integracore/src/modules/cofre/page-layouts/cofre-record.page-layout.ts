import { definePageLayout, PageLayoutTabLayoutMode } from 'integra-sdk/define';

import { COFRE_UNIVERSAL_IDENTIFIERS } from 'src/modules/cofre/constants/cofre-universal-identifiers';

const IDS = COFRE_UNIVERSAL_IDENTIFIERS.recordPage;

// Só a aba do cofre: sem aba de campos nem linha do tempo, para o bloco cifrado não aparecer solto.
export default definePageLayout({
  universalIdentifier: IDS.pageLayout,
  name: 'Página do cofre',
  type: 'RECORD_PAGE',
  objectUniversalIdentifier: COFRE_UNIVERSAL_IDENTIFIERS.object,
  // Sem isso o IntegraCore prende a 1ª aba na coluna estreita da esquerda.
  isFirstTabPinned: false,
  tabs: [
    {
      universalIdentifier: IDS.abaCofre,
      title: 'Cofre',
      position: 0,
      icon: 'IconLock',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: IDS.widgetCofre,
          title: 'Cofre',
          type: 'FRONT_COMPONENT',
          heightBehavior: 'TAB_VIEWPORT',
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: COFRE_UNIVERSAL_IDENTIFIERS.editor.frontComponent,
          },
        },
      ],
    },
  ],
});
