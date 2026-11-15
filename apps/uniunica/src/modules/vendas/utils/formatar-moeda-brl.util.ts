const FORMATADOR = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const formatarMoedaBrl = (valor: number): string =>
  FORMATADOR.format(valor).replace(/ /g, ' ');
