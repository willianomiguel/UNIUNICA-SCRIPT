import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'integra-sdk/define';

import {
  IDEIA_FIELD_IDS,
  IDEIA_OBJECT_ID,
  WORKSPACE_MEMBER_IDEIAS_AUTOR_FIELD_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

// workspaceMember.ideiasAutor ↔ ideia.autor
export default defineField({
  universalIdentifier: WORKSPACE_MEMBER_IDEIAS_AUTOR_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'ideiasAutor',
  label: 'Ideias sugeridas',
  icon: 'IconBulb',
  relationTargetObjectMetadataUniversalIdentifier: IDEIA_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.autor,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
