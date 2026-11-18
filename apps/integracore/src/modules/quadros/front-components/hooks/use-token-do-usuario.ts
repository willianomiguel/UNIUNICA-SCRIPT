import { useEffect, useState } from 'react';

type AmbienteWorker = {
  process?: { env?: Record<string, string | undefined> };
  frontComponentHostCommunicationApi?: { requestAccessTokenRefresh?: () => Promise<unknown> };
};

const RENOVAR_A_CADA_MS = 4 * 60 * 1000;

const ambiente = () => globalThis as unknown as AmbienteWorker;

export const lerApiUrl = (): string | null => ambiente().process?.env?.TWENTY_API_URL ?? null;

// Token do usuário que o renderer entrega ao worker. O iframe do Excalidraw não consegue pedir renovação
// sozinho, então o worker renova de tempos em tempos e repassa pelo hash.
export const useTokenDoUsuario = (): string | null => {
  const [token, setToken] = useState<string | null>(() => ambiente().process?.env?.TWENTY_APP_ACCESS_TOKEN ?? null);

  useEffect(() => {
    const intervalo = setInterval(async () => {
      try {
        const novo = await ambiente().frontComponentHostCommunicationApi?.requestAccessTokenRefresh?.();

        if (typeof novo === 'string' && novo !== '') {
          setToken(novo);
        }
      } catch {
        // Mantém o token atual; se ele vencer, o editor avisa "Sessão expirada".
      }
    }, RENOVAR_A_CADA_MS);

    return () => clearInterval(intervalo);
  }, []);

  return token;
};
