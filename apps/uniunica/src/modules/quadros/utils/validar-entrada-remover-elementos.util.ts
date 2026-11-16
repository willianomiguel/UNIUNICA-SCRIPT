import { LIMITES_IA_QUADRO } from 'src/modules/quadros/constants/limites-ia-quadro.constant';
import { type EntradaRemoverElementos } from 'src/modules/quadros/types/entrada-remover-elementos';
import { type ResultadoValidacao } from 'src/modules/quadros/types/resultado-validacao';
import { ehObjetoQuadro, validarQuadroId } from 'src/modules/quadros/utils/validar-comum-quadro.util';

export const validarEntradaRemoverElementos = (
  entrada: unknown,
): ResultadoValidacao<EntradaRemoverElementos> => {
  if (!ehObjetoQuadro(entrada)) {
    return { ok: false, erro: 'Entrada inválida: envie um objeto com quadroId e ids.' };
  }

  const quadroId = validarQuadroId(entrada.quadroId);

  if (!quadroId.ok) {
    return quadroId;
  }

  if (!Array.isArray(entrada.ids) || entrada.ids.length === 0) {
    return { ok: false, erro: 'Informe ids: lista com os ids dos elementos a remover (veja quadro_ler).' };
  }

  if (entrada.ids.length > LIMITES_IA_QUADRO.idsParaRemover) {
    return {
      ok: false,
      erro: `Ids demais (${entrada.ids.length}); o máximo por chamada é ${LIMITES_IA_QUADRO.idsParaRemover}.`,
    };
  }

  const ids: string[] = [];

  for (const id of entrada.ids) {
    if (typeof id !== 'string' || id.trim() === '' || id.length > LIMITES_IA_QUADRO.idMaximo) {
      return {
        ok: false,
        erro: `Todos os ids devem ser textos não vazios de até ${LIMITES_IA_QUADRO.idMaximo} caracteres.`,
      };
    }

    if (!ids.includes(id)) {
      ids.push(id);
    }
  }

  return { ok: true, valor: { quadroId: quadroId.valor, ids } };
};
