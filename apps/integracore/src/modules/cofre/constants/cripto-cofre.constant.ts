// Parâmetros da criptografia do cofre.
// PBKDF2-SHA256 com 600 mil rodadas (recomendação OWASP); leva ~3 s em JS puro, uma vez ao abrir.
export const CRIPTO_COFRE = {
  ITERACOES_PADRAO: 600_000,
  // Abaixo disso o bloco é recusado (protege contra bloco adulterado com derivação fraca).
  ITERACOES_MINIMAS: 100_000,
  BYTES_SAL: 16,
  BYTES_CHAVE: 32,
  BYTES_NONCE: 24,
  // O bloco cifrado é legível por Admin, chave de API e IA: a senha precisa resistir a ataque fora do sistema.
  TAMANHO_MINIMO_SENHA: 16,
  BYTES_TAG: 16,
} as const;

// Fecha o cofre depois deste tempo sem mexer.
export const COFRE_TRAVA_AUTOMATICA_MS = 5 * 60 * 1000;
