import { type IntervaloDatas } from 'src/modules/vendas/types/intervalo-datas';

// Same-length window immediately before the given one, for period-over-period comparison.
export const obterIntervaloAnterior = (
  intervalo: IntervaloDatas,
): IntervaloDatas => {
  const duracao = intervalo.fim.getTime() - intervalo.inicio.getTime();

  return {
    inicio: new Date(intervalo.inicio.getTime() - duracao),
    fim: new Date(intervalo.inicio.getTime()),
  };
};
