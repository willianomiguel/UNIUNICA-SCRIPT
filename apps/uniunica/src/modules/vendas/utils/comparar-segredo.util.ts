import { createHash, timingSafeEqual } from 'crypto';

// Constant-time comparison; hashing first makes lengths equal so the length itself does not leak.
export const compararSegredo = (
  recebido: string | null | undefined,
  esperado: string | null | undefined,
): boolean => {
  if (!recebido || !esperado) {
    return false;
  }

  const hashRecebido = createHash('sha256').update(recebido).digest();
  const hashEsperado = createHash('sha256').update(esperado).digest();

  return timingSafeEqual(hashRecebido, hashEsperado);
};
