import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'integra-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const FIELDS = DOCS_UNIVERSAL_IDENTIFIERS.fields;

export default defineField({
  universalIdentifier: FIELDS.projetoOnDocumento,
  objectUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
  type: FieldType.RELATION,
  name: 'projeto',
  label: 'Projeto',
  description: 'Projeto ao qual o documento pertence',
  icon: 'IconBriefcase',
  relationTargetObjectMetadataUniversalIdentifier: OBJECTS.projeto.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: FIELDS.documentosOnProjeto,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'projetoId',
  },
});
