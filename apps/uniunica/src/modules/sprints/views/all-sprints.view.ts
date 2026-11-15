import { defineView, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

const F = SPRINTS_IDS.sprintFields;

const COLUNAS: Array<[string, string, number]> = [
  ['db8bd01c-e218-46c8-a0d9-6cab3ca12aa8', F.nome, 200],
  ['5c08a02f-db0f-4e6a-b382-b498edf38948', F.status, 130],
  ['849defc8-4b39-419e-92d7-8eac52764769', F.dataInicio, 130],
  ['9935a0a3-3efb-4fb7-82ee-2bfbe37b7428', F.dataFim, 130],
  ['1cdf9e1e-1cf8-4570-8dd8-c1d17d761a6d', F.capacidadePontos, 150],
  ['7abdab2c-8562-4064-96a7-276249994d1f', F.pontosTotais, 130],
  ['4bbd823e-fefd-4a98-87b0-e52e9c1ab562', F.pontosConcluidos, 150],
  ['178e8558-17bc-4b28-8106-0101a8076944', F.precisaEncerrar, 140],
  ['3cd6450d-c9d4-450a-bf3c-e42402275897', F.projeto, 160],
  ['495116d0-5aed-4ae3-b1db-9a2c3c0e7017', F.objetivo, 260],
];

export default defineView({
  universalIdentifier: SPRINTS_IDS.views.allSprints,
  name: 'Sprints',
  objectUniversalIdentifier: SPRINTS_IDS.objects.sprint,
  type: ViewType.TABLE,
  icon: 'IconRun',
  position: 0,
  fields: COLUNAS.map(([universalIdentifier, fieldMetadataUniversalIdentifier, size], position) => ({
    universalIdentifier,
    fieldMetadataUniversalIdentifier,
    position,
    isVisible: true,
    size,
  })),
  sorts: [
    {
      universalIdentifier: '3db514bc-edc2-4d17-be0a-fdbf82ac1bbd',
      fieldMetadataUniversalIdentifier: F.dataInicio,
      direction: ViewSortDirection.DESC,
    },
  ],
});
