import { OBJECTS } from 'src/modules/shared/constants/objects';

// IDs estáveis do módulo quadros. Nunca altere depois do primeiro sync.
export const QUADROS_UNIVERSAL_IDENTIFIERS = {
  object: OBJECTS.quadro.universalIdentifier,
  fields: {
    nome: '707393cf-a0cc-4505-912c-2a58a012f24e',
    descricao: '42a5eb06-07cf-40a2-8d9e-21b4f7dcd102',
    conteudo: '1b56fb98-8bcb-4caf-8acb-47abd72b44a3',
    cena: '6dc86ad9-5e50-4665-b8e3-a4e1da529c6b',
    projetoOnQuadro: 'f54b1b38-07be-4b8c-af6e-7047cba844ce',
    quadrosOnProjeto: '20fbce03-891a-487d-9dd0-3d0a2b03ee7d',
  },
  views: {
    todos: '8f776a38-5344-46ca-aeb9-fd47aab6819c',
    recordPageFields: 'c5269351-e824-4807-ab1d-9c7164b7f4ad',
  },
  editor: {
    frontComponent: 'd887bb49-cbed-47a5-a6ed-55ed75667053',
  },
  recordPage: {
    pageLayout: '6249b031-2aa6-4d7e-a59e-598cbcf22a69',
    abaQuadro: '2f3ec6dc-b6d0-417a-b3bd-0bc1378374a1',
    widgetQuadro: 'fa656004-63e5-40f1-b175-77b896998d4a',
    abaDetalhes: 'ef6a9a6a-372d-407d-9e33-2d6f9b51e1d0',
    widgetDetalhes: 'c7958888-424a-428d-943b-219bfcc471ba',
    abaLinhaDoTempo: '0cfec3df-eba0-486f-9c37-5e01f7405705',
    widgetLinhaDoTempo: '672aca71-e8ec-4c37-a9b6-57452095630b',
  },
  quadrosNavigationMenuItem: '35e9066b-ad06-478b-8369-c68c0316e37d',
  logicFunctions: {
    desenharDiagrama: '7c2a02e7-252f-46ea-9e37-98dbdb3960ee',
    adicionarElementos: 'c7fd1955-b6a9-42e2-b340-42705eb63e8d',
    ler: '3431e57a-4b54-4078-8efc-50139b62f5d8',
    removerElementos: '65ef8eca-1892-4385-8bd7-87e815133889',
    conversarIa: 'e6a28f91-d81a-4ab3-9b5c-45afec2333e0',
  },
  skill: '86f56c0f-cf49-427a-87e4-b686c9795390',
} as const;
