import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'integra-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';

const FIELDS = DOCS_UNIVERSAL_IDENTIFIERS.fields;

export default defineField({
  universalIdentifier: FIELDS.documentoPai,
  objectUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
  type: FieldType.RELATION,
  name: 'documentoPai',
  label: 'Documento pai',
  description: 'Documento acima deste na árvore da wiki',
  icon: 'IconHierarchy',
  relationTargetObjectMetadataUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
  relationTargetFieldMetadataUniversalIdentifier: FIELDS.subdocumentos,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'documentoPaiId',
  },
});
