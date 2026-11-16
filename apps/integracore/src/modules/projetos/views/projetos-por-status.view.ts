import { defineView, ViewType } from 'integra-sdk/define';

import { PROJETO_STATUS_OPTIONS } from 'src/modules/projetos/constants/projeto-status-options';
import {
  PROJETO_FIELD_IDS,
  PROJETO_OBJECT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

const GROUP_IDS = [
  '33619297-9085-4b57-88b8-07af5a3924fd',
  'ea54b674-2a1e-435c-aef8-f23da20d3ea1',
  '76de1653-ba73-4988-b529-44f2ec042e64',
  '7a730a33-8efb-4032-8057-406177494df0',
  'b4243c56-ad45-4ad6-a8f2-a5f638a4c153',
  'aa09fdd4-7404-45dd-b50c-999ace064590',
];

export default defineView({
  universalIdentifier: 'a31794d8-cd6b-4f90-b069-a84e98265fed',
  name: 'Kanban por status',
  objectUniversalIdentifier: PROJETO_OBJECT_ID,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 1,
  mainGroupByFieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.status,
  fields: [
    { universalIdentifier: '1b06da49-00b6-4ab4-a787-93c2b537cd88', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.nome, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'a8d8cdf6-de0f-48c9-93af-d955d8bc01ec', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.status, position: 1, isVisible: true, size: 150 },
    { universalIdentifier: '69cb1ff1-f755-4901-98c7-35586f880204', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.prioridade, position: 2, isVisible: true, size: 120 },
    { universalIdentifier: '839b91e3-b648-4378-96da-783b67ee29dd', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.area, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: 'f9a07172-6585-4cde-9416-2ec7ce892264', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.responsavel, position: 4, isVisible: true, size: 170 },
    { universalIdentifier: 'bb9ed74c-c3e7-4d70-97f0-efa7fda9b5c2', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataInicio, position: 5, isVisible: true, size: 130 },
    { universalIdentifier: '5d9e85ce-4fc6-4fad-ba04-d21411d415b9', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.dataFim, position: 6, isVisible: true, size: 130 },
    { universalIdentifier: '15efe7f5-13f2-4e87-b382-d46b5f199527', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.progresso, position: 7, isVisible: true, size: 120 },
    { universalIdentifier: '45cd07f6-55f6-40f5-8624-96dd6526331a', fieldMetadataUniversalIdentifier: PROJETO_FIELD_IDS.trimestre, position: 8, isVisible: true, size: 110 },
  ],
  groups: PROJETO_STATUS_OPTIONS.map((option, index) => ({
    universalIdentifier: GROUP_IDS[index],
    fieldValue: option.value,
    position: index,
    isVisible: true,
  })),
});
