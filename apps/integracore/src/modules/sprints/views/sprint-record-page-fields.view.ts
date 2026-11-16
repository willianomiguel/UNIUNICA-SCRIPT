import { defineView, ViewType } from 'integra-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

const F = SPRINTS_IDS.sprintFields;

const CAMPOS: Array<[string, string]> = [
  ['f54137d8-ad4b-447c-ac33-3d92ddcaaf99', F.status],
  ['554f8f4a-a21c-4c7e-a517-193ec3b96cef', F.objetivo],
  ['ba1841c9-711e-47e4-a303-e1abdea86297', F.dataInicio],
  ['535c2c02-b0b1-4c8a-9162-ff4af0b172c7', F.dataFim],
  ['29a4212c-dd16-4e91-ad09-eb5e65b37b1f', F.capacidadePontos],
  ['dcf7a4a4-7bd3-4b0a-89b0-c3f15d38b471', F.pontosTotais],
  ['0ffaf0a4-37bb-4752-95f4-d19280b28493', F.pontosConcluidos],
  ['73eba312-bfe7-484e-bab6-0f8433f75726', F.precisaEncerrar],
  ['7c1a19b7-de23-4c71-bc95-03ee06dde573', F.projeto],
];

export default defineView({
  universalIdentifier: SPRINTS_IDS.views.sprintRecordPageFields,
  name: 'sprint-record-page-fields',
  objectUniversalIdentifier: SPRINTS_IDS.objects.sprint,
  type: ViewType.FIELDS_WIDGET,
  icon: 'IconListDetails',
  position: 0,
  fields: CAMPOS.map(([universalIdentifier, fieldMetadataUniversalIdentifier], position) => ({
    universalIdentifier,
    fieldMetadataUniversalIdentifier,
    position,
    isVisible: true,
    size: 200,
  })),
});
