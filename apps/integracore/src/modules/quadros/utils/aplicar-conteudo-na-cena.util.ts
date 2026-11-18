import { type CenaQuadro } from 'src/modules/quadros/types/cena-quadro';
import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { type OpcoesCenaQuadro } from 'src/modules/quadros/types/opcoes-cena-quadro';
import { converterParaExcalidraw, sortearSemente } from 'src/modules/quadros/utils/converter-para-excalidraw.util';

// As ferramentas da IA calculam sobre a visão simplificada (`antes` → `depois`); aqui o resultado volta para a cena.
// Novo id = elemento criado; id que sumiu = apagado (com versão maior, para a mescla do editor aceitar).
// Mudanças em elementos que já existiam (ex.: pontas de seta recalculadas) ficam com o Excalidraw.
export const aplicarConteudoNaCena = (
  cena: CenaQuadro,
  antes: ConteudoQuadro,
  depois: ConteudoQuadro,
  opcoes: OpcoesCenaQuadro,
): CenaQuadro => {
  const idsDepois = new Set(depois.elementos.map((elemento) => elemento.id));
  const idsAntes = new Set(antes.elementos.map((elemento) => elemento.id));
  const removidos = new Set(antes.elementos.filter((elemento) => !idsDepois.has(elemento.id)).map((elemento) => elemento.id));
  const novos = depois.elementos.filter((elemento) => !idsAntes.has(elemento.id));

  const comRemocoes = cena.elements.map((elemento) => {
    const sai =
      removidos.has(elemento.id) || (typeof elemento.containerId === 'string' && removidos.has(elemento.containerId));

    return sai && !elemento.isDeleted
      ? {
          ...elemento,
          isDeleted: true,
          version: (elemento.version ?? 1) + 1,
          versionNonce: sortearSemente(opcoes),
          updated: opcoes.agora,
        }
      : elemento;
  });

  const { criados, alterados } = converterParaExcalidraw(novos, comRemocoes, opcoes);
  const alteradosPorId = new Map(alterados.map((elemento) => [elemento.id, elemento]));

  return {
    ...cena,
    elements: [...comRemocoes.map((elemento) => alteradosPorId.get(elemento.id) ?? elemento), ...criados],
  };
};
