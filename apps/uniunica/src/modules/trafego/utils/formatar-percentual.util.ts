import { formatarNumero } from 'src/modules/trafego/utils/formatar-numero.util';

// Recebe o percentual já multiplicado por 100 (ex.: CTR 2.5 → "2,50%").
export const formatarPercentual = (valor: number | null | undefined): string =>
  valor === null || valor === undefined || !Number.isFinite(valor)
    ? '—'
    : `${formatarNumero(valor, 2)}%`;
