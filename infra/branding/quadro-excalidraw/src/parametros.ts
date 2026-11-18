export type Tema = 'light' | 'dark';

export type Parametros = { quadroId: string; api: string; token: string; tema: Tema };

// O front component passa id, token e tema no #hash: não vai para o servidor nem para o Referer.
// A API é sempre a origem que serviu esta página; nunca vem do hash, para o token não ir a outro host.
export const lerParametros = (): Parametros | null => {
  const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
  const quadroId = hash.get('id') ?? '';
  const token = hash.get('t') ?? '';

  if (!/^[0-9a-f-]{36}$/i.test(quadroId) || token === '') {
    return null;
  }

  return { quadroId, api: new URL(location.href).origin, token, tema: hash.get('tema') === 'dark' ? 'dark' : 'light' };
};
