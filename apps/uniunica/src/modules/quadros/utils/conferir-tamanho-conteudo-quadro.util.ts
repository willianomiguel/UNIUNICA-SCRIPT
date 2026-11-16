import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';

// Devolve a mensagem de erro quando o JSON passaria do teto; null quando cabe.
export const conferirTamanhoConteudoQuadro = (conteudo: ConteudoQuadro): string | null => {
  const tamanho = JSON.stringify(conteudo).length;

  if (tamanho <= LIMITES_QUADRO.bytesMaximo) {
    return null;
  }

  return `O quadro ficaria grande demais (${Math.ceil(tamanho / 1000)} mil caracteres; máximo ${LIMITES_QUADRO.bytesMaximo / 1000} mil). Simplifique os traços, remova elementos ou use outro quadro.`;
};
