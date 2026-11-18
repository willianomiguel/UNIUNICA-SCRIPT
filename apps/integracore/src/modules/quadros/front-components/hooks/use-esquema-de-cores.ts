import { useEffect, useState } from 'react';

const CONSULTA = '(prefers-color-scheme: dark)';

const lerEsquema = (): 'light' | 'dark' => {
  try {
    return globalThis.matchMedia?.(CONSULTA).matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

// No worker, useThemeColorScheme() fica sempre no padrão "light"; o matchMedia do renderer segue o tema do
// workspace (claro, escuro ou do sistema), então é ele que decide o tema do Excalidraw.
export const useEsquemaDeCores = (): 'light' | 'dark' => {
  const [esquema, setEsquema] = useState(lerEsquema);

  useEffect(() => {
    const lista = globalThis.matchMedia?.(CONSULTA);
    const aoMudar = () => setEsquema(lerEsquema());

    lista?.addEventListener?.('change', aoMudar);

    return () => lista?.removeEventListener?.('change', aoMudar);
  }, []);

  return esquema;
};
