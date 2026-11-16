import { type EntradaLerQuadro } from 'src/modules/quadros/types/entrada-ler-quadro';
import { type ResultadoValidacao } from 'src/modules/quadros/types/resultado-validacao';
import { ehObjetoQuadro, validarQuadroId } from 'src/modules/quadros/utils/validar-comum-quadro.util';

export const validarEntradaLerQuadro = (entrada: unknown): ResultadoValidacao<EntradaLerQuadro> => {
  if (!ehObjetoQuadro(entrada)) {
    return { ok: false, erro: 'Entrada inválida: envie um objeto com quadroId.' };
  }

  const quadroId = validarQuadroId(entrada.quadroId);

  if (!quadroId.ok) {
    return quadroId;
  }

  return { ok: true, valor: { quadroId: quadroId.valor } };
};
