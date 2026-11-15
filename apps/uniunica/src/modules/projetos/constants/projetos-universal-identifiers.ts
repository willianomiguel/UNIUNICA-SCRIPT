// IDs universais do módulo projetos. NUNCA altere um ID depois do primeiro sync.
import { OBJECTS } from 'src/modules/shared/constants/objects';

export const PROJETO_OBJECT_ID = OBJECTS.projeto.universalIdentifier;
export const IDEIA_OBJECT_ID = OBJECTS.ideia.universalIdentifier;

// Campos de projeto
export const PROJETO_FIELD_IDS = {
  nome: 'a8f3ae8b-4f32-4e65-adcf-baf30284a46d',
  descricao: 'a3551b35-6452-441c-acd4-87964a894716',
  status: '0ee0c243-3f1d-47ba-a0fe-fb07b9bec86e',
  prioridade: '59aad5ae-e012-4a49-a438-6217a551c4a8',
  area: 'fbe9d89e-d4c4-48c2-bfcc-b3bb95c8d095',
  dataInicio: '28a49668-e85d-4af7-a4a6-36d3048f6c69',
  dataFim: '0d04fd81-08a9-49ad-8f08-ab48616ca83c',
  progresso: '3cccb34a-4e64-40c2-93a8-106b3803c076',
  trimestre: '42ff23be-e8d1-4cf6-8770-33d6b8cdc61f',
  responsavel: '8efce0f0-1890-4f2e-9b5f-be1319c1a6ce',
  ideias: '7c0836e9-252c-4b22-b147-c0a902b17867',
} as const;

// Campos de ideia
export const IDEIA_FIELD_IDS = {
  titulo: '0a4bef4f-6921-47fb-a943-9eb8df85c9ff',
  descricao: '59cdc549-34e5-48f6-90ac-c1b7ac0d2808',
  autor: 'b8022278-7326-48c7-9de0-9b23acd8f10e',
  area: '7e43bed7-5cb3-423f-9881-5103c59b7a6d',
  status: '2ac5f53b-dd1c-4074-888b-1c36e90f684c',
  impacto: 'bdc4633c-e01b-4368-b10d-13b8e5a66e58',
  esforco: '5a133569-284c-4d48-a0b4-65f5a1a0294c',
  votos: '6c9965a0-b392-47e0-b37f-0d101bb864ab',
  pontuacao: 'ff792300-ee0e-4786-a029-cf715c1e22f8',
  projeto: '0ba4d86a-7819-4dc2-8716-04b686310f86',
} as const;

// Lados inversos das relações em Membro do workspace (objeto padrão)
export const WORKSPACE_MEMBER_PROJETOS_RESPONSAVEL_FIELD_ID = '16227958-1144-438c-ab60-7d71598d79e9';
export const WORKSPACE_MEMBER_IDEIAS_AUTOR_FIELD_ID = '1652935a-b8de-49c0-87fa-1471b9810c83';

// Roadmap (página standalone)
export const ROADMAP_FRONT_COMPONENT_ID = '5f54657a-2fa8-4209-9f18-4f5df93cf944';
export const ROADMAP_PAGE_LAYOUT_ID = 'af52fc0c-a304-49a8-ad58-75d4bba73ef7';
export const ROADMAP_PAGE_LAYOUT_TAB_ID = 'aa9dfec4-b566-44c8-bd3c-4c4be8c6008b';
export const ROADMAP_PAGE_LAYOUT_WIDGET_ID = 'abf9db6e-95a1-4701-8df7-7b51fe28f122';
export const ROADMAP_NAVIGATION_MENU_ITEM_ID = 'e8f82430-609f-4be9-8d90-363c5746c895';

// Ações de ideia (comandos)
export const VOTAR_IDEIAS_FRONT_COMPONENT_ID = '0c6643ac-97b5-45b0-92c9-850d6751e89c';
export const VOTAR_IDEIAS_COMMAND_MENU_ITEM_ID = 'fc767e90-d142-4e90-96d7-8893aa0a5831';
export const VOTAR_IDEIAS_LOGIC_FUNCTION_ID = '9320ab73-1560-4bca-968d-2b1cfa6d225e';
export const TRANSFORMAR_IDEIAS_FRONT_COMPONENT_ID = 'ede12bdb-cb01-4094-88fd-1ff7adad2c06';
export const TRANSFORMAR_IDEIAS_COMMAND_MENU_ITEM_ID = '14c4e099-9b0a-4552-9f12-48d29a309997';
export const TRANSFORMAR_IDEIAS_LOGIC_FUNCTION_ID = '14738224-ec2a-4b63-9ab4-84674117001d';

// Funções de evento do banco
export const RECALCULAR_PONTUACAO_IDEIA_LOGIC_FUNCTION_ID = '251f7884-b223-4352-b8dd-47618276c7ab';
export const RECALCULAR_PROGRESSO_PROJETO_LOGIC_FUNCTION_ID = 'ba31f02c-9f4b-436d-9732-54c639f9a101';

// Rotas HTTP das ações (chamadas pelos componentes de comando)
export const VOTAR_IDEIAS_ROUTE_PATH = '/projetos/ideias/votar';
export const TRANSFORMAR_IDEIAS_ROUTE_PATH = '/projetos/ideias/transformar-em-projeto';
