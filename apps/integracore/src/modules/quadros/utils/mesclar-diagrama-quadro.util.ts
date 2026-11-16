import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { type EntradaDesenharDiagrama } from 'src/modules/quadros/types/entrada-desenhar-diagrama';
import { caixaDosElementos } from 'src/modules/quadros/utils/caixa-dos-elementos.util';
import { conferirTamanhoConteudoQuadro } from 'src/modules/quadros/utils/conferir-tamanho-conteudo-quadro.util';
import { layoutDiagramaQuadro } from 'src/modules/quadros/utils/layout-diagrama.util';

// Distância entre o desenho que já existe e o diagrama novo.
export const MARGEM_ENTRE_DESENHOS = 120;

export type ResultadoMesclaDiagrama =
  | { ok: true; conteudo: ConteudoQuadro; mapaIds: Record<string, string>; criados: number }
  | { ok: false; erro: string };

export const mesclarDiagramaQuadro = (
  atual: ConteudoQuadro,
  entrada: Pick<EntradaDesenharDiagrama, 'nos' | 'ligacoes' | 'direcao' | 'substituir'>,
): ResultadoMesclaDiagrama => {
  const existentes = entrada.substituir ? [] : atual.elementos;
  const caixa = caixaDosElementos(existentes);
  const direcao = entrada.direcao ?? 'direita';
  const origem: [number, number] = caixa
    ? direcao === 'direita'
      ? [caixa.x + caixa.largura + MARGEM_ENTRE_DESENHOS, caixa.y]
      : [caixa.x, caixa.y + caixa.altura + MARGEM_ENTRE_DESENHOS]
    : [0, 0];
  const zMaximo = existentes.reduce((maior, elemento) => Math.max(maior, elemento.z), -1);
  const layout = layoutDiagramaQuadro(entrada, { origem, zInicial: zMaximo + 1 });
  const elementos = [...existentes, ...layout.elementos];

  if (elementos.length > LIMITES_QUADRO.elementosMaximo) {
    return {
      ok: false,
      erro: `O quadro passaria de ${LIMITES_QUADRO.elementosMaximo} elementos (${elementos.length}). Use substituir: true ou um quadro novo.`,
    };
  }

  // Substituir descarta também a câmera, que poderia apontar para uma área agora vazia.

  const conteudo: ConteudoQuadro = entrada.substituir ? { versao: atual.versao, elementos } : { ...atual, elementos };
  const grandeDemais = conferirTamanhoConteudoQuadro(conteudo);

  if (grandeDemais !== null) {
    return { ok: false, erro: grandeDemais };
  }

  return {
    ok: true,
    conteudo,
    mapaIds: layout.mapaIds,
    criados: layout.elementos.length,
  };
};
