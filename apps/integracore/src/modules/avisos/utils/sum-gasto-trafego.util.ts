import { currencyToNumber } from 'src/modules/avisos/utils/currency-to-number.util';

export const sumGastoTrafego = (
  metricas: Array<{ gasto?: unknown; data?: unknown }>,
  today: string,
): number =>
  metricas
    .filter((metrica) => typeof metrica.data === 'string' && metrica.data.slice(0, 10) === today)
    .reduce((total, metrica) => total + currencyToNumber(metrica.gasto), 0);
