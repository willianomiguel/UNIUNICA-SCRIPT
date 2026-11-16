import { defineField, FieldType, RelationType } from 'integra-sdk/define';

import {
  IDEIA_FIELD_IDS,
  IDEIA_OBJECT_ID,
  PROJETO_FIELD_IDS,
  PROJETO_OBJECT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

// projeto.ideias ↔ ideia.projeto (dono: projetos)
export default defineField({
  universalIdentifier: PROJETO_FIELD_IDS.ideias,
  objectUniversalIdentifier: PROJETO_OBJECT_ID,
  type: FieldType.RELATION,
  name: 'ideias',
  label: 'Ideias',
  description: 'Ideias que deram origem a este projeto',
  icon: 'IconBulb',
  relationTargetObjectMetadataUniversalIdentifier: IDEIA_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier: IDEIA_FIELD_IDS.projeto,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
