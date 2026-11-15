import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';

const FIELDS = DOCS_UNIVERSAL_IDENTIFIERS.fields;

export default defineView({
  universalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.views.fixados,
  name: 'Fixados',
  objectUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
  type: ViewType.TABLE,
  icon: 'IconPin',
  position: 2,
  fields: [
    { universalIdentifier: 'c0f9ce4f-d003-45f1-b640-8eb1406b2a08', fieldMetadataUniversalIdentifier: FIELDS.titulo, position: 0, isVisible: true, size: 280 },
    { universalIdentifier: 'fda200b8-b528-494f-8841-849a9a610687', fieldMetadataUniversalIdentifier: FIELDS.categoria, position: 1, isVisible: true, size: 160 },
    { universalIdentifier: '5010e013-2fa6-4e1e-9a4a-058475983fdf', fieldMetadataUniversalIdentifier: FIELDS.status, position: 2, isVisible: true, size: 130 },
    { universalIdentifier: '9e1e919c-e774-44cb-8ac1-84a1bd262e2b', fieldMetadataUniversalIdentifier: FIELDS.ordem, position: 3, isVisible: true, size: 90 },
  ],
  filters: [
    {
      universalIdentifier: 'c82c54ab-67f9-4686-bf43-f960ccdeceac',
      fieldMetadataUniversalIdentifier: FIELDS.fixado,
      operand: ViewFilterOperand.IS,
      value: 'true',
    },
  ],
  sorts: [
    { universalIdentifier: '3135a746-3125-430d-9954-5d57d9e0a5cc', fieldMetadataUniversalIdentifier: FIELDS.ordem, direction: ViewSortDirection.ASC },
  ],
});
