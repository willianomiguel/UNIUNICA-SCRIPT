import { reaisParaCentavos } from 'src/modules/assistente/utils/reais-para-centavos.util';

// Arredonda para 2 casas (centavos) sem acumular erro de float.
export const arredondarReais = (valor: number): number => reaisParaCentavos(valor) / 100;
