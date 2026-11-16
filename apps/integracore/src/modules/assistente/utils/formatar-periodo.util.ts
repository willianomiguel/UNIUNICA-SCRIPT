import { type IntervaloIso } from 'src/modules/assistente/types/intervalo-iso';
import { formatarDataBr } from 'src/modules/assistente/utils/formatar-data-br.util';

export const formatarPeriodo = (intervalo: IntervaloIso): string =>
  `${formatarDataBr(intervalo.inicio)} a ${formatarDataBr(intervalo.fim)}`;
