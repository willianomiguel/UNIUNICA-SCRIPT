import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';

// Mantém as linhas com data entre inicio e fim (inclusive, "AAAA-MM-DD"). Sem data = fora.
export const filtrarPorPeriodo = (
  linhas: LinhaMetrica[],
  inicio: string | null,
  fim: string | null,
): LinhaMetrica[] =>
  linhas.filter((linha) => {
    if (!linha.data) {
      return false;
    }

    const data = linha.data.slice(0, 10);

    return (!inicio || data >= inicio) && (!fim || data <= fim);
  });
