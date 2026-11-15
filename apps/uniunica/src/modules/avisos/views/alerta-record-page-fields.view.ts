import { defineView, ViewType } from 'twenty-sdk/define';

import { AVISOS_UNIVERSAL_IDENTIFIERS } from 'src/modules/avisos/constants/avisos-universal-identifiers';

const FIELDS = AVISOS_UNIVERSAL_IDENTIFIERS.fields;

const ORDER = [
  ['fa66ce38-1cdd-4f25-9253-59ef3f945831', FIELDS.ativo],
  ['96f4de8f-d6c8-48cc-90a2-06008c2e0b4d', FIELDS.metrica],
  ['1dfab736-2758-42e3-aa74-c2b2212353c9', FIELDS.operador],
  ['bcfe7b9f-ea39-4970-8943-f7c2d4c3e956', FIELDS.limite],
  ['383af585-3cc3-4854-af36-eed5a4775b7f', FIELDS.janelaDias],
  ['543ba5c9-0bf3-4fbe-bdce-8dbe3e919e61', FIELDS.canal],
  ['46964770-6d46-410e-8c08-ef53162c1d2e', FIELDS.destino],
  ['9a90c2ac-47b0-4e78-829c-fed3ddeb6945', FIELDS.mensagem],
  ['d1466e59-f6d7-4a59-99fb-756c814a4471', FIELDS.cooldownHoras],
  ['491a5967-a25c-4549-b736-d8252741b397', FIELDS.ultimoValor],
  ['19ff383b-cbe7-4431-a684-044401e5bdd1', FIELDS.ultimoDisparo],
  ['3e651c64-2ae3-4edc-badd-c66e4d006120', FIELDS.ultimaVerificacao],
  ['13cb52cb-af78-4440-a0f9-996b3f8147c4', FIELDS.ultimoErro],
] as const;

export default defineView({
  universalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.views.recordPageFields,
  name: 'alerta-record-page-fields',
  objectUniversalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.object,
  type: ViewType.FIELDS_WIDGET,
  icon: 'IconListDetails',
  position: 0,
  fields: ORDER.map(([universalIdentifier, fieldMetadataUniversalIdentifier], position) => ({
    universalIdentifier,
    fieldMetadataUniversalIdentifier,
    position,
    isVisible: true,
    size: 200,
  })),
});
