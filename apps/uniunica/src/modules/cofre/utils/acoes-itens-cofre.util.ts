import { type ConteudoCofre } from 'src/modules/cofre/types/conteudo-cofre';
import { type ItemCofre } from 'src/modules/cofre/types/item-cofre';

export type DadosItemCofre = Omit<ItemCofre, 'id' | 'atualizadoEm'>;

export const ITEM_COFRE_VAZIO: DadosItemCofre = {
  nome: '',
  endereco: '',
  usuario: '',
  senha: '',
  observacoes: '',
};

// Cria ou atualiza um item (id null = novo). Mantém a ordem; novos vão para o fim.
export const salvarItemCofre = (
  conteudo: ConteudoCofre,
  id: string | null,
  dados: DadosItemCofre,
  agora: string,
  gerarId: () => string,
): ConteudoCofre => {
  const nome = dados.nome.trim();

  if (nome === '') {
    throw new Error('Dê um nome ao acesso.');
  }

  const item = { ...dados, nome, atualizadoEm: agora };

  if (id === null) {
    return { ...conteudo, itens: [...conteudo.itens, { ...item, id: gerarId() }] };
  }

  if (!conteudo.itens.some((existente) => existente.id === id)) {
    throw new Error('Esse acesso não existe mais. Recarregue o cofre.');
  }

  return {
    ...conteudo,
    itens: conteudo.itens.map((existente) => (existente.id === id ? { ...item, id } : existente)),
  };
};

export const removerItemCofre = (conteudo: ConteudoCofre, id: string): ConteudoCofre => ({
  ...conteudo,
  itens: conteudo.itens.filter((item) => item.id !== id),
});

export const filtrarItensCofre = (itens: ItemCofre[], busca: string): ItemCofre[] => {
  const termo = busca.trim().toLocaleLowerCase('pt-BR');

  if (termo === '') {
    return itens;
  }

  return itens.filter((item) =>
    [item.nome, item.endereco, item.usuario, item.observacoes].some((campo) =>
      campo.toLocaleLowerCase('pt-BR').includes(termo),
    ),
  );
};
