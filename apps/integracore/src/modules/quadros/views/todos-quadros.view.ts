import { defineView, ViewType } from 'integra-sdk/define';

import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';

const FIELDS = QUADROS_UNIVERSAL_IDENTIFIERS.fields;

export default defineView({
  universalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.views.todos,
  name: 'Todos',
  objectUniversalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.object,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: [
    { universalIdentifier: '82074da4-d1c6-452c-8e25-45088d034d37', fieldMetadataUniversalIdentifier: FIELDS.nome, position: 0, isVisible: true, size: 280 },
    { universalIdentifier: 'f2721385-b0ad-4df0-b52e-f358797d0ba7', fieldMetadataUniversalIdentifier: FIELDS.projetoOnQuadro, position: 1, isVisible: true, size: 200 },
    { universalIdentifier: 'd8946fcf-ba35-4e65-a559-7037a3ebf70a', fieldMetadataUniversalIdentifier: FIELDS.descricao, position: 2, isVisible: true, size: 320 },
  ],
});
