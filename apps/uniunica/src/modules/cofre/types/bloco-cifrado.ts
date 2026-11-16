// Formato gravado no campo conteudoCifrado (JSON em texto). Só o que é público vai em claro:
// parâmetros da derivação de chave, sal e nonce. Os dados vão cifrados e autenticados.
export type BlocoCifrado = {
  v: 1;
  kdf: 'pbkdf2-sha256';
  iteracoes: number;
  sal: string;
  cifra: 'xchacha20poly1305';
  nonce: string;
  dados: string;
};
