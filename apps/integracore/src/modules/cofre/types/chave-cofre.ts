// Chave derivada da senha do cofre. Fica só na memória da aba enquanto o cofre está aberto.
export type ChaveCofre = {
  chave: Uint8Array;
  sal: string;
  iteracoes: number;
};
