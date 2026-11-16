import { OBJECTS } from 'src/modules/shared/constants/objects';

// IDs estáveis do módulo cofre. Nunca altere depois do primeiro sync.
export const COFRE_UNIVERSAL_IDENTIFIERS = {
  object: OBJECTS.cofre.universalIdentifier,
  fields: {
    nome: '208d9df7-3e8c-44ed-aacd-721c78d94554',
    conteudoCifrado: '4d9c6cda-3741-4540-9a3e-86295ed97741',
  },
  views: {
    todos: 'deef102e-3e24-4cb6-bf6f-946be9ef9762',
    todosCampoNome: '42683b47-d314-4e23-bd07-d4195064a823',
  },
  editor: {
    frontComponent: 'ad6c4b5c-1240-40b1-83e9-fb6c9a48f037',
  },
  recordPage: {
    pageLayout: '68db089b-05ab-4ed7-ad4a-7a70d20818de',
    abaCofre: 'caceaad5-c8ba-41a8-9abf-8717ebbfeaf0',
    widgetCofre: '72dea203-701f-45c8-90b4-c9c50d0d93a7',
  },
  navigationMenuItem: '87abc1ad-1726-47b7-bbfc-580f1c52e4ad',
  roleMembroComCofre: 'a4a55f63-b1b4-4487-a640-68ccbd8a72f0',
} as const;
