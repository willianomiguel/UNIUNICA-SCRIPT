import { defineView, ViewType } from 'integra-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';

const FIELDS = DOCS_UNIVERSAL_IDENTIFIERS.fields;

const CATEGORIAS = [
  { value: 'ESTRATEGIA', id: '096e3c4a-b12e-4b6a-9166-6c27b386dfb2' },
  { value: 'PROCESSO', id: '8542a8bc-ada6-441a-8c59-3e444a9fdeec' },
  { value: 'TECNICO', id: 'e94bcbdc-f075-496f-8f72-6447d4092664' },
  { value: 'MARKETING', id: '1ecd0dbf-d915-487d-b035-324ae97bc8f8' },
  { value: 'FINANCEIRO', id: 'abcea059-6cbd-44b9-9023-7d85502b135a' },
  { value: 'ATA_REUNIAO', id: 'f063ae8d-911e-4cb1-a8bc-7547760fd16d' },
  { value: 'OUTRO', id: 'b69b9db8-9fc9-46f7-890a-8ac8dddf44b9' },
];

export default defineView({
  universalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.views.porCategoria,
  name: 'Por categoria',
  objectUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 1,
  mainGroupByFieldMetadataUniversalIdentifier: FIELDS.categoria,
  fields: [
    { universalIdentifier: 'd9ef5011-a9b3-4440-b41f-e37a28e79d71', fieldMetadataUniversalIdentifier: FIELDS.titulo, position: 0, isVisible: true, size: 220 },
    { universalIdentifier: 'f41433d3-af2c-467a-aaf7-d176edf13a01', fieldMetadataUniversalIdentifier: FIELDS.categoria, position: 1, isVisible: true, size: 150 },
    { universalIdentifier: '4c2dc51e-f32a-44b7-bdc0-0fa40548f2bc', fieldMetadataUniversalIdentifier: FIELDS.status, position: 2, isVisible: true, size: 130 },
    { universalIdentifier: 'c4020b85-05ac-4350-9f8b-1db89795db9f', fieldMetadataUniversalIdentifier: FIELDS.fixado, position: 3, isVisible: true, size: 100 },
  ],
  groups: CATEGORIAS.map((categoria, index) => ({
    universalIdentifier: categoria.id,
    fieldValue: categoria.value,
    position: index,
    isVisible: true,
  })),
});
