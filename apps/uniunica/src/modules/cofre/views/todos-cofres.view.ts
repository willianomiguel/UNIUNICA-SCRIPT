import { defineView, ViewType } from 'twenty-sdk/define';

import { COFRE_UNIVERSAL_IDENTIFIERS } from 'src/modules/cofre/constants/cofre-universal-identifiers';

// Só o nome aparece na lista; o bloco cifrado fica fora da tabela.
export default defineView({
  universalIdentifier: COFRE_UNIVERSAL_IDENTIFIERS.views.todos,
  name: 'Todos',
  objectUniversalIdentifier: COFRE_UNIVERSAL_IDENTIFIERS.object,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: [
    {
      universalIdentifier: COFRE_UNIVERSAL_IDENTIFIERS.views.todosCampoNome,
      fieldMetadataUniversalIdentifier: COFRE_UNIVERSAL_IDENTIFIERS.fields.nome,
      position: 0,
      isVisible: true,
      size: 320,
    },
  ],
});
