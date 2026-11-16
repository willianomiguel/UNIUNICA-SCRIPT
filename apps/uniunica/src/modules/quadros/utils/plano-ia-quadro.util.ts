import { CORES_QUADRO } from 'src/modules/quadros/constants/cores-quadro.constant';
import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { type DiagramaQuadro } from 'src/modules/quadros/types/diagrama-quadro';
import { ehObjetoQuadro } from 'src/modules/quadros/utils/validar-comum-quadro.util';

// O agente do Twenty (runAgent) não recebe as ferramentas do app na 2.58, então a IA devolve um plano em JSON
// e o próprio app desenha com o mesmo layout das ferramentas do MCP.
// A IA do Twenty só aceita esquema "plano" (campos texto/número/sim-não): o diagrama vem como JSON dentro de um texto.
export const SCHEMA_PLANO_IA = {
  type: 'object' as const,
  additionalProperties: false as const,
  required: ['resposta', 'desenhar', 'diagrama'],
  properties: {
    resposta: { type: 'string' as const, description: 'Resposta curta em português para a pessoa (1 ou 2 frases).' },
    desenhar: { type: 'boolean' as const, description: 'true quando o pedido é para desenhar algo no quadro.' },
    diagrama: {
      type: 'string' as const,
      description:
        'Só quando desenhar=true: JSON {"direcao":"direita"|"baixo","substituir":false,"nos":[{"id","texto","forma":"retangulo"|"elipse"|"nota","cor"}],"ligacoes":[{"de","para","texto"}]}. Senão, "".',
    },
  },
};

export const INSTRUCOES_PLANO_IA = [
  'Você é o assistente de um quadro branco. Responda sempre em português do Brasil.',
  'Quando pedirem um desenho (fluxo, processo, organograma, mapa, etapas), devolva desenhar=true e o campo diagrama com um JSON:',
  '{"direcao":"direita","substituir":false,"nos":[{"id":"a","texto":"...","forma":"retangulo","cor":"blue"}],"ligacoes":[{"de":"a","para":"b","texto":""}]}',
  `- cores permitidas: ${CORES_QUADRO.map((cor) => cor.valor).join(', ')};`,
  '- nós com id curto e único, texto curto; para cartão com título use "**Título**" na primeira linha e o resto abaixo;',
  '- forma: elipse para início/fim, nota para observações, retangulo para o resto;',
  '- cores com sentido: green sucesso, red erro/risco, yellow atenção, blue etapa normal, gray neutro;',
  `- no máximo 40 nós e textos de até ${LIMITES_QUADRO.textoMaximo} caracteres;`,
  '- direcao "direita" para fluxos curtos, "baixo" para listas de etapas longas.',
  'O app faz o layout: não invente posições. Use o resumo do quadro atual para não repetir o que já existe.',
  'Se não for pedido de desenho, responda em "resposta" com desenhar=false e diagrama vazio ("").',
  'substituir=true só quando a pessoa pedir explicitamente para apagar ou refazer o quadro inteiro.',
].join('\n');

export type PlanoIaQuadro = {
  resposta: string;
  diagrama: (DiagramaQuadro & { substituir: boolean }) | null;
};

const texto = (valor: unknown): string => (typeof valor === 'string' ? valor : '');

// Converte o objeto devolvido pela IA; a validação de verdade fica com validarEntradaDesenharDiagrama.
export const interpretarPlanoIa = (bruto: unknown): PlanoIaQuadro | null => {
  if (!ehObjetoQuadro(bruto)) {
    return null;
  }

  const resposta = texto(bruto.resposta).trim() || 'Pronto.';
  let diagrama: unknown = bruto.diagrama;

  if (typeof diagrama === 'string') {
    try {
      diagrama = diagrama.trim() === '' ? null : JSON.parse(diagrama);
    } catch {
      diagrama = null;
    }
  }

  const corpo = ehObjetoQuadro(diagrama) ? diagrama : bruto;
  const nos = Array.isArray(corpo.nos) ? corpo.nos.filter(ehObjetoQuadro) : [];

  if (bruto.desenhar !== true || nos.length === 0) {
    return { resposta, diagrama: null };
  }

  const ligacoes = (Array.isArray(corpo.ligacoes) ? corpo.ligacoes.filter(ehObjetoQuadro) : []).map((ligacao) => ({
    de: texto(ligacao.de),
    para: texto(ligacao.para),
    ...(texto(ligacao.texto).trim() !== '' ? { texto: texto(ligacao.texto).trim() } : {}),
  }));

  return {
    resposta,
    diagrama: {
      nos: nos.map((no) => ({
        id: texto(no.id),
        texto: texto(no.texto),
        ...(typeof no.forma === 'string' ? { forma: no.forma as 'retangulo' | 'elipse' | 'nota' } : {}),
        ...(typeof no.cor === 'string' ? { cor: no.cor as DiagramaQuadro['nos'][number]['cor'] } : {}),
      })),
      ligacoes,
      direcao: corpo.direcao === 'baixo' ? 'baixo' : 'direita',
      substituir: corpo.substituir === true,
    },
  };
};
