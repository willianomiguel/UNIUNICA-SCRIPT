export const dividirEmLotes = <T>(itens: T[], tamanho: number): T[][] => {
  const lotes: T[][] = [];
  const passo = Math.max(1, Math.floor(tamanho));

  for (let inicio = 0; inicio < itens.length; inicio += passo) {
    lotes.push(itens.slice(inicio, inicio + passo));
  }

  return lotes;
};
