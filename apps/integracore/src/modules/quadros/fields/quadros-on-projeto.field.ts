import { defineField, FieldType, RelationType } from 'integra-sdk/define';

import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const FIELDS = QUADROS_UNIVERSAL_IDENTIFIERS.fields;

export default defineField({
  universalIdentifier: FIELDS.quadrosOnProjeto,
  objectUniversalIdentifier: OBJECTS.projeto.universalIdentifier,
  type: FieldType.RELATION,
  name: 'quadros',
  label: 'Quadros',
  description: 'Quadros brancos ligados a este projeto',
  icon: 'IconPresentation',
  relationTargetObjectMetadataUniversalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.object,
  relationTargetFieldMetadataUniversalIdentifier: FIELDS.projetoOnQuadro,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
