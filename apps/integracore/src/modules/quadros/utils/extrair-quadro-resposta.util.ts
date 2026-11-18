import { type OpcoesCenaQuadro } from 'src/modules/quadros/types/opcoes-cena-quadro';
import { type QuadroLido } from 'src/modules/quadros/types/quadro-lido';
import { cenaDoConteudoLegado } from 'src/modules/quadros/utils/cena-do-conteudo-legado.util';
import { converterDeExcalidraw } from 'src/modules/quadros/utils/converter-de-excalidraw.util';
import { normalizarCenaQuadro } from 'src/modules/quadros/utils/normalizar-cena-quadro.util';
import { normalizarConteudoQuadro } from 'src/modules/quadros/utils/normalizar-conteudo-quadro.util';

// Resposta REST de um registro: { data: { quadro: {...} } } (ou { data: {...} } direto).
export const extrairQuadroResposta = (
  resposta: unknown,
  opcoes: OpcoesCenaQuadro = { agora: Date.now(), aleatorio: Math.random },
): QuadroLido | null => {
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

  const cena =
    normalizarCenaQuadro(candidato.cena) ?? cenaDoConteudoLegado(normalizarConteudoQuadro(candidato.conteudo), opcoes);

  return {
    id: candidato.id,
    nome: typeof candidato.nome === 'string' ? candidato.nome : '',
    cena,
    conteudo: { versao: 1, elementos: converterDeExcalidraw(cena.elements) },
    updatedAt: typeof candidato.updatedAt === 'string' ? candidato.updatedAt : null,
  };
};
