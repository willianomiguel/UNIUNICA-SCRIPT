import { normalizarTextoBusca } from 'src/modules/assistente/utils/normalizar-texto-busca.util';
import { type CategoriaResumo } from 'src/modules/financeiro/types/categoria-resumo';

// Acha a categoria pelo nome ignorando maiúsculas e acentos. Sem igualdade exata, aceita
// uma única categoria que contenha (ou esteja contida em) o texto; ambígua ou ausente = null.
export const encontrarCategoria = (
  categorias: CategoriaResumo[],
  nome: string,
): CategoriaResumo | null => {
  const alvo = normalizarTextoBusca(nome);

  if (alvo === '') {
    return null;
  }

  const exata = categorias.find((categoria) => normalizarTextoBusca(categoria.nome) === alvo);

  if (exata) {
    return exata;
  }

  const parecidas = categorias.filter((categoria) => {
    const candidata = normalizarTextoBusca(categoria.nome);

    return candidata.includes(alvo) || alvo.includes(candidata);
  });

  return parecidas.length === 1 ? parecidas[0] : null;
};
