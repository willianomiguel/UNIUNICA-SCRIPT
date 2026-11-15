const TAMANHO_MAXIMO = 200;

// Reduz uma URL ou caminho ao caminho da página ("/oferta"), sem query string nem âncora.
export const normalizarPagina = (valor: unknown): string | null => {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return null;
  }

  let caminho = valor.trim();

  try {
    if (/^https?:\/\//i.test(caminho)) {
      const url = new URL(caminho);

      caminho = `${url.hostname}${url.pathname}`;
    }
  } catch {
    // mantém o texto original
  }

  caminho = caminho.split(/[?#]/)[0].replace(/\/+$/, '') || '/';

  return caminho.toLowerCase().slice(0, TAMANHO_MAXIMO);
};
