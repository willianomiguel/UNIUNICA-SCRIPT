import { defineView, ViewType } from 'integra-sdk/define';

import { AVISOS_UNIVERSAL_IDENTIFIERS } from 'src/modules/avisos/constants/avisos-universal-identifiers';

const FIELDS = AVISOS_UNIVERSAL_IDENTIFIERS.fields;

export default defineView({
  universalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.views.alertas,
  name: 'Alertas',
  objectUniversalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.object,
  type: ViewType.TABLE,
  icon: 'IconBell',
  position: 0,
  fields: [
    { universalIdentifier: '9b58932b-dfcd-4913-8421-3f45e772e187', fieldMetadataUniversalIdentifier: FIELDS.nome, position: 0, isVisible: true, size: 260 },
    { universalIdentifier: 'b96d7858-02b5-4cbb-9f7d-1b6bb78997c6', fieldMetadataUniversalIdentifier: FIELDS.ativo, position: 1, isVisible: true, size: 90 },
    { universalIdentifier: '9275c631-d0e5-48f4-b391-9c78f8fd2808', fieldMetadataUniversalIdentifier: FIELDS.metrica, position: 2, isVisible: true, size: 210 },
    { universalIdentifier: 'ff7f7ab1-64bd-478a-9b48-e0ad0f37a8d5', fieldMetadataUniversalIdentifier: FIELDS.operador, position: 3, isVisible: true, size: 120 },
    { universalIdentifier: 'abbe4c65-cf9a-4983-8375-bafd86623609', fieldMetadataUniversalIdentifier: FIELDS.limite, position: 4, isVisible: true, size: 100 },
    { universalIdentifier: '14155439-c3ed-484a-a33e-1bd40dc14516', fieldMetadataUniversalIdentifier: FIELDS.janelaDias, position: 5, isVisible: true, size: 110 },
    { universalIdentifier: '4459d830-2f1b-4ba9-9c08-45c97d7f6eb2', fieldMetadataUniversalIdentifier: FIELDS.canal, position: 6, isVisible: true, size: 110 },
    { universalIdentifier: '4d23021f-45ae-4698-b548-432002ad90cf', fieldMetadataUniversalIdentifier: FIELDS.ultimoValor, position: 7, isVisible: true, size: 120 },
    { universalIdentifier: '8e21e435-8a67-4ed3-9a64-8584bc22fad6', fieldMetadataUniversalIdentifier: FIELDS.ultimoDisparo, position: 8, isVisible: true, size: 160 },
    { universalIdentifier: 'd67c73de-f2ee-4e68-80e8-d14713530b28', fieldMetadataUniversalIdentifier: FIELDS.ultimoErro, position: 9, isVisible: true, size: 200 },
  ],
});
