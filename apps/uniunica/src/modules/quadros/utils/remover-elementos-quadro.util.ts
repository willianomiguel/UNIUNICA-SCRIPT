import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { type ResultadoRemocaoQuadro } from 'src/modules/quadros/types/resultado-remocao-quadro';

// Remove elementos por id. Setas presas a uma forma removida saem junto. Nunca mexe no registro.
export const removerElementosQuadro = (atual: ConteudoQuadro, ids: string[]): ResultadoRemocaoQuadro => {
  const existentes = new Set(atual.elementos.map((elemento) => elemento.id));
  const pedidos = new Set(ids);
  const naoEncontrados = ids.filter((id) => !existentes.has(id));
  const removidos = ids.filter((id) => existentes.has(id));
  const setasRemovidasPorLigacao: string[] = [];

  const elementos = atual.elementos.filter((elemento) => {
    if (pedidos.has(elemento.id)) {
      return false;
    }

    if (
      elemento.tipo === 'seta' &&
      ((elemento.deId !== undefined && pedidos.has(elemento.deId)) ||
        (elemento.paraId !== undefined && pedidos.has(elemento.paraId)))
    ) {
      setasRemovidasPorLigacao.push(elemento.id);

      return false;
    }

    return true;
  });

  return { conteudo: { ...atual, elementos }, removidos, setasRemovidasPorLigacao, naoEncontrados };
};
