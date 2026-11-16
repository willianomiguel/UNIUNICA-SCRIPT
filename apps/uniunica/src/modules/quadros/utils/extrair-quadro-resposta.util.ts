import { type QuadroLido } from 'src/modules/quadros/types/quadro-lido';
import { normalizarConteudoQuadro } from 'src/modules/quadros/utils/normalizar-conteudo-quadro.util';

// Resposta REST de um registro: { data: { quadro: {...} } } (ou { data: {...} } direto).
export const extrairQuadroResposta = (resposta: unknown): QuadroLido | null => {
  const data = (resposta as { data?: Record<string, unknown> } | null)?.data;

  if (typeof data !== 'object' || data === null) {
    return null;
  }

  const candidato = (typeof data.id === 'string' ? data : Object.values(data)[0]) as
    | Record<string, unknown>
    | undefined;

  if (typeof candidato !== 'object' || candidato === null || typeof candidato.id !== 'string') {
    return null;
  }

  return {
    id: candidato.id,
    nome: typeof candidato.nome === 'string' ? candidato.nome : '',
    conteudo: normalizarConteudoQuadro(candidato.conteudo),
    updatedAt: typeof candidato.updatedAt === 'string' ? candidato.updatedAt : null,
  };
};
