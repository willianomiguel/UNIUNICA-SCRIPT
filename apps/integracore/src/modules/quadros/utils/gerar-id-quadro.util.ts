// UUID v4. Usa crypto.randomUUID quando existe (Node e navegador); senão monta à mão.
export const gerarIdQuadro = (): string => {
  const cripto = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;

  if (typeof cripto?.randomUUID === 'function') {
    return cripto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (caractere) => {
    const aleatorio = Math.floor(Math.random() * 16);

    return (caractere === 'x' ? aleatorio : (aleatorio % 4) + 8).toString(16);
  });
};
