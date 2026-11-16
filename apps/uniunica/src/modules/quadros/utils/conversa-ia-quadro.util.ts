import { type MensagemIaQuadro } from 'src/modules/quadros/types/mensagem-ia-quadro';
import { type ResultadoValidacao } from 'src/modules/quadros/types/resultado-validacao';
import { ehObjetoQuadro, validarQuadroId } from 'src/modules/quadros/utils/validar-comum-quadro.util';

const MENSAGEM_MAXIMA = 4000;
const HISTORICO_MAXIMO = 20;

export type EntradaConversaIa = { quadroId: string; mensagem: string; historico: MensagemIaQuadro[] };

export const validarEntradaConversaIa = (entrada: unknown): ResultadoValidacao<EntradaConversaIa> => {
  if (!ehObjetoQuadro(entrada)) {
    return { ok: false, erro: 'Envie { quadroId, mensagem }.' };
  }

  const quadroId = validarQuadroId(entrada.quadroId);

  if (!quadroId.ok) {
    return quadroId;
  }

  if (typeof entrada.mensagem !== 'string' || entrada.mensagem.trim() === '') {
    return { ok: false, erro: 'Escreva o que você quer que a IA faça no quadro.' };
  }

  if (entrada.mensagem.length > MENSAGEM_MAXIMA) {
    return { ok: false, erro: `Mensagem longa demais (máximo ${MENSAGEM_MAXIMA} caracteres).` };
  }

  const historico = (Array.isArray(entrada.historico) ? entrada.historico : [])
    .filter(
      (item): item is MensagemIaQuadro =>
        ehObjetoQuadro(item) &&
        (item.papel === 'usuario' || item.papel === 'ia') &&
        typeof item.texto === 'string',
    )
    .slice(-HISTORICO_MAXIMO)
    .map((item) => ({ papel: item.papel, texto: item.texto.slice(0, MENSAGEM_MAXIMA) }));

  return { ok: true, valor: { quadroId: quadroId.valor, mensagem: entrada.mensagem.trim(), historico } };
};

// Mensagens no formato da IA do Twenty (ai.generate); a última leva o id do quadro para a IA saber onde desenhar.
export const montarMensagensIa = ({ quadroId, mensagem, historico }: EntradaConversaIa) => [
  ...historico.map((item) => ({
    role: item.papel === 'usuario' ? ('user' as const) : ('assistant' as const),
    content: item.texto,
  })),
  { role: 'user' as const, content: `[Quadro aberto: quadroId = ${quadroId}]\n${mensagem}` },
];

export const traduzirErroIa = (erro: string | null | undefined): string => {
  const texto = (erro ?? '').toLowerCase();

  if (/api[_ ]?key|provider|model|not configured|no .*model|unauthori[sz]ed/.test(texto)) {
    return 'A IA do Twenty não está configurada neste servidor. Falta a chave da IA (ANTHROPIC_API_KEY ou OPENAI_API_KEY).';
  }

  return 'A IA não conseguiu responder agora. Tente de novo em instantes.';
};
