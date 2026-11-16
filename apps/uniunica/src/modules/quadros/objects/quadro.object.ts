import { defineObject, FieldType } from 'twenty-sdk/define';

import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const FIELDS = QUADROS_UNIVERSAL_IDENTIFIERS.fields;

export default defineObject({
  universalIdentifier: OBJECTS.quadro.universalIdentifier,
  nameSingular: OBJECTS.quadro.nameSingular,
  namePlural: OBJECTS.quadro.namePlural,
  labelSingular: 'Quadro',
  labelPlural: 'Quadros',
  description: 'Quadro branco: caixas, notas, setas e desenho livre.',
  icon: 'IconPresentation',
  labelIdentifierFieldMetadataUniversalIdentifier: FIELDS.nome,
  fields: [
    {
      universalIdentifier: FIELDS.nome,
      type: FieldType.TEXT,
      name: 'nome',
      label: 'Nome',
      description: 'Nome do quadro',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: FIELDS.descricao,
      type: FieldType.TEXT,
      name: 'descricao',
      label: 'Descrição',
      description: 'Para que serve este quadro',
      icon: 'IconAlignLeft',
      isNullable: true,
    },
    {
      universalIdentifier: FIELDS.conteudo,
      type: FieldType.RAW_JSON,
      name: 'conteudo',
      label: 'Conteúdo',
      description: 'Elementos desenhados (JSON versionado; edite pela aba Quadro)',
      icon: 'IconBraces',
      isNullable: true,
    },
  ],
});
