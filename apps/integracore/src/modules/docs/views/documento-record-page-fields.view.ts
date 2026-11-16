import { defineView, ViewType } from 'integra-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';

const FIELDS = DOCS_UNIVERSAL_IDENTIFIERS.fields;

export default defineView({
  universalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.views.recordPageFields,
  name: 'documento-record-page-fields',
  objectUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
  type: ViewType.FIELDS_WIDGET,
  icon: 'IconListDetails',
  position: 0,
  fields: [
    { universalIdentifier: '870c9f0e-cca2-455f-a54a-faf4d51eace7', fieldMetadataUniversalIdentifier: FIELDS.categoria, position: 0, isVisible: true, size: 200 },
    { universalIdentifier: 'a36131c0-517b-4ce0-b7b0-a8ab128e7f5e', fieldMetadataUniversalIdentifier: FIELDS.status, position: 1, isVisible: true, size: 200 },
    { universalIdentifier: '170c8167-29c8-416d-b20a-81059457b6f8', fieldMetadataUniversalIdentifier: FIELDS.fixado, position: 2, isVisible: true, size: 200 },
    { universalIdentifier: 'c4f3abb3-aaa0-4acc-ad1f-21b1429c3bd7', fieldMetadataUniversalIdentifier: FIELDS.ordem, position: 3, isVisible: true, size: 200 },
    { universalIdentifier: 'f1be8cc7-3406-432b-afe4-fe0f0ca6538f', fieldMetadataUniversalIdentifier: FIELDS.documentoPai, position: 4, isVisible: true, size: 200 },
    { universalIdentifier: '5673fa49-052b-494a-b555-e8f5f237b48f', fieldMetadataUniversalIdentifier: FIELDS.projetoOnDocumento, position: 5, isVisible: true, size: 200 },
  ],
});
