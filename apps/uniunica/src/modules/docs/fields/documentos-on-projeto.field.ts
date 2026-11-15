import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const FIELDS = DOCS_UNIVERSAL_IDENTIFIERS.fields;

export default defineField({
  universalIdentifier: FIELDS.documentosOnProjeto,
  objectUniversalIdentifier: OBJECTS.projeto.universalIdentifier,
  type: FieldType.RELATION,
  name: 'documentos',
  label: 'Documentos',
  description: 'Documentos da wiki ligados a este projeto',
  icon: 'IconFileText',
  relationTargetObjectMetadataUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
  relationTargetFieldMetadataUniversalIdentifier: FIELDS.projetoOnDocumento,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
