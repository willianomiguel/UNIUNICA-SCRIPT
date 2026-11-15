import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';

const FIELDS = DOCS_UNIVERSAL_IDENTIFIERS.fields;

export default defineField({
  universalIdentifier: FIELDS.subdocumentos,
  objectUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
  type: FieldType.RELATION,
  name: 'subdocumentos',
  label: 'Subdocumentos',
  description: 'Documentos filhos na árvore da wiki',
  icon: 'IconFiles',
  relationTargetObjectMetadataUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
  relationTargetFieldMetadataUniversalIdentifier: FIELDS.documentoPai,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
