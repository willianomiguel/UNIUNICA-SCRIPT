import { type ObjetoJson } from 'src/modules/vendas/types/objeto-json';
import { ehObjetoJson } from 'src/modules/vendas/utils/eh-objeto-json.util';

// Reads a nested object by path; returns an empty object when any step is missing.
export const lerObjeto = (origem: unknown, ...caminho: string[]): ObjetoJson => {
  let atual: unknown = origem;

  for (const chave of caminho) {
    atual = ehObjetoJson(atual) ? atual[chave] : undefined;
  }

  return ehObjetoJson(atual) ? atual : {};
};
