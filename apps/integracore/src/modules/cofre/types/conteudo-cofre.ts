import { type ItemCofre } from 'src/modules/cofre/types/item-cofre';

// O que fica DENTRO do bloco cifrado. Nunca é enviado ao servidor sem cifrar.
export type ConteudoCofre = {
  versao: 1;
  itens: ItemCofre[];
};
