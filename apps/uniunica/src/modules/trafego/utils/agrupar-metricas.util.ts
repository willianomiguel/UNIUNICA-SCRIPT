import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { type TotaisMetricas } from 'src/modules/trafego/types/totais-metricas';
import { somarMetricas } from 'src/modules/trafego/utils/somar-metricas.util';

// Agrupa linhas por uma chave e soma cada grupo.
export const agruparMetricas = (
  linhas: LinhaMetrica[],
  chaveDe: (linha: LinhaMetrica) => string,
): Record<string, TotaisMetricas> => {
  const grupos: Record<string, LinhaMetrica[]> = {};

  for (const linha of linhas) {
    const chave = chaveDe(linha);

    (grupos[chave] ??= []).push(linha);
  }

  return Object.fromEntries(
    Object.entries(grupos).map(([chave, itens]) => [chave, somarMetricas(itens)]),
  );
};
