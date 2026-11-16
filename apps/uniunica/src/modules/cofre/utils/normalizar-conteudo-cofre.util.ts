import { type ConteudoCofre } from 'src/modules/cofre/types/conteudo-cofre';
import { type ItemCofre } from 'src/modules/cofre/types/item-cofre';

const texto = (valor: unknown): string => (typeof valor === 'string' ? valor : '');

// Aceita só o formato conhecido; campos estranhos são descartados.
export const normalizarConteudoCofre = (bruto: unknown): ConteudoCofre => {
  const objeto = bruto as { versao?: unknown; itens?: unknown } | null;

  if (!objeto || typeof objeto !== 'object' || objeto.versao !== 1 || !Array.isArray(objeto.itens)) {
    throw new Error('Formato do cofre desconhecido.');
  }

  const itens: ItemCofre[] = objeto.itens
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .filter((item) => typeof item.id === 'string' && item.id !== '')
    .map((item) => ({
      id: texto(item.id),
      nome: texto(item.nome),
      endereco: texto(item.endereco),
      usuario: texto(item.usuario),
      senha: texto(item.senha),
      observacoes: texto(item.observacoes),
      atualizadoEm: texto(item.atualizadoEm),
    }));

  return { versao: 1, itens };
};
