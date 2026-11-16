import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'integra-sdk/define';

import {
  PROJETO_FIELD_IDS,
  PROJETO_OBJECT_ID,
  WORKSPACE_MEMBER_PROJETOS_RESPONSAVEL_FIELD_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

// workspaceMember.projetosResponsavel ↔ projeto.responsavel
export default defineField({
  universalIdentifier: WORKSPACE_MEMBER_PROJETOS_RESPONSAVEL_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'projetosResponsavel',
  label: 'Projetos sob responsabilidade',
  icon: 'IconRocket',
  relationTargetObjectMetadataUniversalIdentifier: PROJETO_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.responsavel,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
