import { OBJECTS } from 'src/modules/shared/constants/objects';

// IDs estáveis do módulo avisos. Nunca altere depois do primeiro sync.
export const AVISOS_UNIVERSAL_IDENTIFIERS = {
  object: OBJECTS.alerta.universalIdentifier,
  fields: {
    nome: 'ada05133-47f2-4e49-804c-2c68b3c143b2',
    ativo: '6f3468ce-3793-4b3e-9e0a-de85997f0bac',
    metrica: '51b4aaa7-c005-46b8-b368-d90e6d80a9a2',
    operador: 'f43c7c33-1e59-40ff-9e50-d3ce5fa48b95',
    limite: '36f75c2a-73e0-45fa-a52c-de0d1c7a21f0',
    janelaDias: 'fa089214-bfe8-4533-bef8-a530d67fe5e7',
    canal: 'de17e2fe-7437-4ece-886b-18bb85596a41',
    destino: '2c6b88f4-ac18-4bac-8cfe-35914390d09c',
    ultimoValor: 'd85488f1-8460-45c2-a294-fffeac92e524',
    ultimoDisparo: 'c312c3b5-187b-4982-bc57-9973c68c39e8',
    cooldownHoras: '174d6cb3-4377-4126-b214-77d3bf799ef0',
    mensagem: 'bc288054-576b-493c-84d7-fbfb389002f7',
    ultimaVerificacao: 'c0f7ec0e-eff4-49a8-90b1-58469fc551c9',
    ultimoErro: 'ebb960fd-5de0-49e3-966d-ff8023cfd79a',
  },
  views: {
    alertas: 'f65ee4fd-c4bb-479c-95da-e84692107ed4',
    recordPageFields: '96a33abf-e641-4495-acb8-7e885bf5e0af',
  },
  pageLayout: '18b32b56-a9a8-4a6e-8e4e-396a52e7b6f2',
  navigationMenuItem: 'ca123236-ac0f-4971-abdd-f85390ae838b',
  logicFunctions: {
    avaliarAlertas: '318258bc-bb16-4bc3-ac01-3b6892a3b385',
    testarAlerta: 'a0d80f27-bd8a-4f46-8d22-95ec3aadb512',
  },
  testarAlertaFrontComponent: '874d5cc7-6d28-4f59-88ba-8571dff47341',
  testarAlertaCommandMenuItem: 'aa786e2f-75f4-4980-b0b7-7ac7edee41d3',
  applicationVariables: {
    whatsappApiUrl: 'fa20dd02-9b45-41ee-8bf0-4eb2fe852484',
    whatsappApiToken: '29478c21-53a0-422a-aeb6-a2a164299e98',
    whatsappAuthHeader: '1e18c5a9-4279-469b-9c07-787a5b2cda3e',
  },
} as const;
