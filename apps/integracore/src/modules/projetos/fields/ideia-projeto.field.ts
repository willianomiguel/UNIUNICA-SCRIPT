import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'integra-sdk/define';

import {
  IDEIA_FIELD_IDS,
  IDEIA_OBJECT_ID,
  PROJETO_FIELD_IDS,
  PROJETO_OBJECT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

// ideia.projeto ↔ projeto.ideias (dono: projetos)
export default defineField({
  universalIdentifier: IDEIA_FIELD_IDS.projeto,
  objectUniversalIdentifier: IDEIA_OBJECT_ID,
  type: FieldType.RELATION,
  name: 'projeto',
  label: 'Projeto',
  description: 'Projeto criado a partir desta ideia',
  icon: 'IconRocket',
  relationTargetObjectMetadataUniversalIdentifier: PROJETO_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.ideias,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'projetoId',
  },
});
