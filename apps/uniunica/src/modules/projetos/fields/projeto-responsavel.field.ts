import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  PROJETO_FIELD_IDS,
  PROJETO_OBJECT_ID,
  WORKSPACE_MEMBER_PROJETOS_RESPONSAVEL_FIELD_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

// projeto.responsavel ↔ workspaceMember.projetosResponsavel
export default defineField({
  universalIdentifier: PROJETO_FIELD_IDS.responsavel,
  objectUniversalIdentifier: PROJETO_OBJECT_ID,
  type: FieldType.RELATION,
  name: 'responsavel',
  label: 'Responsável',
  description: 'Pessoa da equipe que conduz o projeto',
  icon: 'IconUserCircle',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKSPACE_MEMBER_PROJETOS_RESPONSAVEL_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'responsavelId',
  },
});
