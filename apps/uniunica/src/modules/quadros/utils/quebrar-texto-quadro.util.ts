// O SVG não quebra linha sozinho e o worker não mede texto: estimamos a largura média
// de um caractere (≈0,56 × tamanho da fonte) e quebramos por palavra.
const LARGURA_MEDIA_CARACTERE = 0.56;

export const quebrarTextoQuadro = (
  texto: string,
  larguraDisponivel: number,
  tamanhoFonte: number,
  maximoLinhas = 50,
): string[] => {
  const caracteresPorLinha = Math.max(1, Math.floor(larguraDisponivel / (tamanhoFonte * LARGURA_MEDIA_CARACTERE)));
  const linhas: string[] = [];

  for (const paragrafo of texto.split('\n')) {
    let atual = '';

    for (const palavraOriginal of paragrafo.split(/\s+/).filter((palavra) => palavra !== '')) {
      let palavra = palavraOriginal;

      while (palavra.length > caracteresPorLinha) {
        if (atual !== '') {
          linhas.push(atual);
          atual = '';
        }
        linhas.push(palavra.slice(0, caracteresPorLinha));
        palavra = palavra.slice(caracteresPorLinha);
      }

      const candidata = atual === '' ? palavra : `${atual} ${palavra}`;

      if (candidata.length > caracteresPorLinha) {
        linhas.push(atual);
        atual = palavra;
      } else {
        atual = candidata;
      }
    }

    linhas.push(atual);
  }

  if (linhas.length > maximoLinhas) {
    return [...linhas.slice(0, maximoLinhas - 1), `${linhas[maximoLinhas - 1]}…`];
  }

  return linhas;
};
