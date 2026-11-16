import { type IntervaloIso } from 'src/modules/assistente/types/intervalo-iso';
import { somarDias } from 'src/modules/trafego/utils/somar-dias.util';

// Período imediatamente anterior, com o mesmo número de dias.
export const obterIntervaloAnteriorIso = (intervalo: IntervaloIso): IntervaloIso => {
  const dias = Math.round((Date.parse(intervalo.fim) - Date.parse(intervalo.inicio)) / 86_400_000) + 1;

  return { inicio: somarDias(intervalo.inicio, -dias), fim: somarDias(intervalo.inicio, -1) };
};
