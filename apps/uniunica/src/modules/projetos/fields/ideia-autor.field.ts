import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  IDEIA_FIELD_IDS,
  IDEIA_OBJECT_ID,
  WORKSPACE_MEMBER_IDEIAS_AUTOR_FIELD_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

// ideia.autor ↔ workspaceMember.ideiasAutor
export default defineField({
  universalIdentifier: IDEIA_FIELD_IDS.autor,
  objectUniversalIdentifier: IDEIA_OBJECT_ID,
  type: FieldType.RELATION,
  name: 'autor',
  label: 'Autor',
  description: 'Quem sugeriu a ideia',
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKSPACE_MEMBER_IDEIAS_AUTOR_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'autorId',
  },
});
