// Minúsculas, sem acento e sem espaços repetidos: para comparar nomes digitados por pessoas/IA.
export const normalizarTextoBusca = (texto: string): string =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
