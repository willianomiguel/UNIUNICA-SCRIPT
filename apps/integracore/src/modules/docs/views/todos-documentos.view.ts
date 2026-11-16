import { defineView, ViewSortDirection, ViewType } from 'integra-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';

const FIELDS = DOCS_UNIVERSAL_IDENTIFIERS.fields;

export default defineView({
  universalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.views.todos,
  name: 'Todos',
  objectUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: [
    { universalIdentifier: '2939528c-e11e-46ac-9389-7600da7ab6e1', fieldMetadataUniversalIdentifier: FIELDS.titulo, position: 0, isVisible: true, size: 280 },
    { universalIdentifier: '8213fb71-6323-47af-ba3a-e342bda72f71', fieldMetadataUniversalIdentifier: FIELDS.categoria, position: 1, isVisible: true, size: 160 },
    { universalIdentifier: '4bba24fb-9808-43b2-8b51-1632b17fe1f1', fieldMetadataUniversalIdentifier: FIELDS.status, position: 2, isVisible: true, size: 130 },
    { universalIdentifier: 'b4910644-df27-4fdd-848f-72ecfb630933', fieldMetadataUniversalIdentifier: FIELDS.fixado, position: 3, isVisible: true, size: 100 },
    { universalIdentifier: '4d000c20-bc9a-46ff-958c-484bc60c6cb4', fieldMetadataUniversalIdentifier: FIELDS.documentoPai, position: 4, isVisible: true, size: 200 },
    { universalIdentifier: '25afefc5-da08-46c9-8e8e-5cf3cbe1fd48', fieldMetadataUniversalIdentifier: FIELDS.projetoOnDocumento, position: 5, isVisible: true, size: 180 },
    { universalIdentifier: '0d48940e-8a09-4989-8d06-4b864d957bd0', fieldMetadataUniversalIdentifier: FIELDS.ordem, position: 6, isVisible: true, size: 90 },
  ],
  sorts: [
    { universalIdentifier: '47612f1a-ec77-4d9e-9e03-11caef7517f7', fieldMetadataUniversalIdentifier: FIELDS.ordem, direction: ViewSortDirection.ASC },
  ],
});
