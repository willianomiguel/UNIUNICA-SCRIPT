import { formatarNumero } from 'src/modules/trafego/utils/formatar-numero.util';

// ROAS 3.2 → "3,20×"
export const formatarRoas = (valor: number | null | undefined): string =>
  valor === null || valor === undefined || !Number.isFinite(valor)
    ? '—'
    : `${formatarNumero(valor, 2)}×`;
