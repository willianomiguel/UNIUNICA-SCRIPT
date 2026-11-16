import { type InputJsonSchema } from 'integra-sdk/logic-function';

import { CORES_QUADRO } from 'src/modules/quadros/constants/cores-quadro.constant';
import { LIMITES_IA_QUADRO } from 'src/modules/quadros/constants/limites-ia-quadro.constant';
import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';

const coresPermitidas = CORES_QUADRO.map((cor) => cor.valor);

const propriedadeQuadroId: InputJsonSchema = {
  type: 'string',
  label: 'Quadro',
  description: 'Id (UUID) do quadro. Descubra com find_many_quadros.',
};

const propriedadeCor: InputJsonSchema = {
  type: 'string',
  enum: coresPermitidas,
  description: `Cor do tema. Valores permitidos: ${coresPermitidas.join(', ')}.`,
};

export const desenharDiagramaInputSchema: InputJsonSchema = {
  type: 'object',
  properties: {
    quadroId: propriedadeQuadroId,
    nos: {
      type: 'array',
      description: `Caixas do diagrama (máximo ${LIMITES_IA_QUADRO.nosMaximo}). O app calcula a posição de cada uma.`,
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Id curto e único DENTRO desta chamada (ex.: "a", "inicio"). Usado só em ligacoes.',
          },
          texto: {
            type: 'string',
            description: `Texto da caixa, curto (máximo ${LIMITES_QUADRO.textoMaximo} caracteres; ideal até 60).`,
          },
          forma: {
            type: 'string',
            enum: ['retangulo', 'elipse', 'nota'],
            description: 'Forma da caixa. Padrão: retangulo. Use elipse para início/fim e nota para observações.',
          },
          cor: propriedadeCor,
        },
        required: ['id', 'texto'],
        additionalProperties: false,
      },
    },
    ligacoes: {
      type: 'array',
      description: 'Setas entre as caixas, usando os ids de nos.',
      items: {
        type: 'object',
        properties: {
          de: { type: 'string', description: 'Id do nó de origem.' },
          para: { type: 'string', description: 'Id do nó de destino.' },
          texto: { type: 'string', description: 'Rótulo opcional da seta (ex.: "sim", "não").' },
        },
        required: ['de', 'para'],
        additionalProperties: false,
      },
    },
    direcao: {
      type: 'string',
      enum: ['direita', 'baixo'],
      description:
        'Sentido do fluxo: "direita" (padrão, da esquerda para a direita) ou "baixo" (de cima para baixo). Também define onde o diagrama novo entra em relação ao desenho existente.',
    },
    substituir: {
      type: 'boolean',
      description:
        'true apaga TODOS os elementos atuais do quadro e desenha só este diagrama. Padrão false: o diagrama é adicionado ao lado/abaixo do que já existe. Só use true se o usuário pediu para refazer o quadro.',
    },
  },
  required: ['quadroId', 'nos'],
  additionalProperties: false,
};

export const adicionarElementosInputSchema: InputJsonSchema = {
  type: 'object',
  properties: {
    quadroId: propriedadeQuadroId,
    elementos: {
      type: 'array',
      description: `Elementos já posicionados (máximo ${LIMITES_IA_QUADRO.elementosPorChamada} por chamada). Coordenadas em pixels do quadro; x cresce para a direita, y para baixo.`,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Id opcional. Se omitido, o app gera um UUID. Devolvido na resposta.' },
          tipo: {
            type: 'string',
            enum: ['retangulo', 'elipse', 'nota', 'texto', 'moldura', 'seta', 'traco'],
            description: 'Tipo do elemento.',
          },
          x: { type: 'number', description: 'Canto superior esquerdo (formas). Se omitido, vai abaixo do desenho atual.' },
          y: { type: 'number', description: 'Canto superior esquerdo (formas).' },
          largura: { type: 'number', description: 'Largura em pixels (formas). Padrão 160.' },
          altura: { type: 'number', description: 'Altura em pixels (formas). Padrão 80.' },
          cor: propriedadeCor,
          texto: {
            type: 'string',
            description: `Texto (formas) ou rótulo (seta). Máximo ${LIMITES_QUADRO.textoMaximo} caracteres.`,
          },
          pontos: {
            type: 'array',
            description: 'Seta/traço: pontos absolutos [[x, y], [x, y], ...]; mínimo 2. Opcional na seta se deId e paraId forem informados.',
            items: { type: 'array', items: { type: 'number' } },
          },
          deId: { type: 'string', description: 'Seta: id da forma de origem (prende a seta à forma).' },
          paraId: { type: 'string', description: 'Seta: id da forma de destino.' },
        },
        required: ['tipo'],
        additionalProperties: false,
      },
    },
  },
  required: ['quadroId', 'elementos'],
  additionalProperties: false,
};

export const lerQuadroInputSchema: InputJsonSchema = {
  type: 'object',
  properties: { quadroId: propriedadeQuadroId },
  required: ['quadroId'],
  additionalProperties: false,
};

export const removerElementosInputSchema: InputJsonSchema = {
  type: 'object',
  properties: {
    quadroId: propriedadeQuadroId,
    ids: {
      type: 'array',
      description: `Ids dos elementos a remover (máximo ${LIMITES_IA_QUADRO.idsParaRemover}); veja quadro_ler. Setas presas às formas removidas saem junto.`,
      items: { type: 'string' },
    },
  },
  required: ['quadroId', 'ids'],
  additionalProperties: false,
};
