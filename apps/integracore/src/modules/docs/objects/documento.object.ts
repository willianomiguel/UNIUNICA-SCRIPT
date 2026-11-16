import { defineObject, FieldType } from 'integra-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const FIELDS = DOCS_UNIVERSAL_IDENTIFIERS.fields;

export default defineObject({
  universalIdentifier: OBJECTS.documento.universalIdentifier,
  nameSingular: OBJECTS.documento.nameSingular,
  namePlural: OBJECTS.documento.namePlural,
  labelSingular: 'Documento',
  labelPlural: 'Documentos',
  description: 'Página da wiki interna: processos, atas, guias e planejamentos.',
  icon: 'IconFileText',
  labelIdentifierFieldMetadataUniversalIdentifier: FIELDS.titulo,
  fields: [
    {
      universalIdentifier: FIELDS.titulo,
      type: FieldType.TEXT,
      name: 'titulo',
      label: 'Título',
      description: 'Título do documento',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: FIELDS.conteudo,
      type: FieldType.RICH_TEXT,
      name: 'conteudo',
      label: 'Conteúdo',
      description: 'Corpo do documento (texto rico / markdown)',
      icon: 'IconFileText',
      isNullable: true,
    },
    {
      universalIdentifier: FIELDS.categoria,
      type: FieldType.SELECT,
      name: 'categoria',
      label: 'Categoria',
      icon: 'IconTag',
      defaultValue: "'OUTRO'",
      options: [
        { position: 0, label: 'Estratégia', value: 'ESTRATEGIA', color: 'purple' },
        { position: 1, label: 'Processo', value: 'PROCESSO', color: 'blue' },
        { position: 2, label: 'Técnico', value: 'TECNICO', color: 'turquoise' },
        { position: 3, label: 'Marketing', value: 'MARKETING', color: 'pink' },
        { position: 4, label: 'Financeiro', value: 'FINANCEIRO', color: 'green' },
        { position: 5, label: 'Ata de reunião', value: 'ATA_REUNIAO', color: 'orange' },
        { position: 6, label: 'Outro', value: 'OUTRO', color: 'gray' },
      ],
    },
    {
      universalIdentifier: FIELDS.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgress',
      defaultValue: "'RASCUNHO'",
      options: [
        { position: 0, label: 'Rascunho', value: 'RASCUNHO', color: 'yellow' },
        { position: 1, label: 'Publicado', value: 'PUBLICADO', color: 'green' },
        { position: 2, label: 'Arquivado', value: 'ARQUIVADO', color: 'gray' },
      ],
    },
    {
      universalIdentifier: FIELDS.fixado,
      type: FieldType.BOOLEAN,
      name: 'fixado',
      label: 'Fixado',
      description: 'Documentos fixados aparecem no topo da wiki',
      icon: 'IconPin',
      defaultValue: false,
    },
    {
      universalIdentifier: FIELDS.ordem,
      type: FieldType.NUMBER,
      name: 'ordem',
      label: 'Ordem',
      description: 'Ordem de exibição entre documentos irmãos (menor primeiro)',
      icon: 'IconSortAscending',
      defaultValue: 0,
      isNullable: true,
    },
  ],
});
