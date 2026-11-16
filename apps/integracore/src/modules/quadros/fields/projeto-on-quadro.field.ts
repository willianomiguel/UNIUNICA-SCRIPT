import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'integra-sdk/define';

import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const FIELDS = QUADROS_UNIVERSAL_IDENTIFIERS.fields;

export default defineField({
  universalIdentifier: FIELDS.projetoOnQuadro,
  objectUniversalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.object,
  type: FieldType.RELATION,
  name: 'projeto',
  label: 'Projeto',
  description: 'Projeto ao qual o quadro pertence',
  icon: 'IconBriefcase',
  relationTargetObjectMetadataUniversalIdentifier: OBJECTS.projeto.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: FIELDS.quadrosOnProjeto,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'projetoId',
  },
});
