import { defineView, ViewType } from 'integra-sdk/define';

import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';

const FIELDS = QUADROS_UNIVERSAL_IDENTIFIERS.fields;

export default defineView({
  universalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.views.recordPageFields,
  name: 'quadro-record-page-fields',
  objectUniversalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.object,
  type: ViewType.FIELDS_WIDGET,
  icon: 'IconListDetails',
  position: 0,
  fields: [
    { universalIdentifier: '96dae3aa-8357-47c7-bec2-e90487c5f354', fieldMetadataUniversalIdentifier: FIELDS.projetoOnQuadro, position: 0, isVisible: true, size: 200 },
    { universalIdentifier: 'a3cecc87-4f31-47c9-922b-88e8acba75ed', fieldMetadataUniversalIdentifier: FIELDS.descricao, position: 1, isVisible: true, size: 200 },
  ],
});
