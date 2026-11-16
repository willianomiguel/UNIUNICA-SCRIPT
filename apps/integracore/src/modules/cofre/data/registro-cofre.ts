import { type RestApiClient, RestApiClientError } from 'integra-client-sdk/rest';

export type RegistroCofre = {
  id: string;
  nome: string;
  conteudoCifrado: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export class ConflitoCofreError extends Error {
  constructor() {
    super('Outra pessoa alterou este cofre agora há pouco. Ele foi recarregado; refaça a última mudança.');
    this.name = 'ConflitoCofreError';
  }
}

const extrairRegistro = (resposta: unknown): Record<string, unknown> | null => {
  const data = (resposta as { data?: Record<string, unknown> } | null)?.data;

  if (!data || typeof data !== 'object') {
    return null;
  }

  const registro = Object.values(data)[0];

  return registro && typeof registro === 'object' ? (registro as Record<string, unknown>) : null;
};

const paraRegistro = (bruto: Record<string, unknown> | null): RegistroCofre | null => {
  if (bruto === null || typeof bruto.id !== 'string') {
    return null;
  }

  return {
    id: bruto.id,
    nome: typeof bruto.nome === 'string' ? bruto.nome : '',
    conteudoCifrado:
      typeof bruto.conteudoCifrado === 'string' && bruto.conteudoCifrado !== '' ? bruto.conteudoCifrado : null,
    createdAt: typeof bruto.createdAt === 'string' ? bruto.createdAt : null,
    updatedAt: typeof bruto.updatedAt === 'string' ? bruto.updatedAt : null,
  };
};

export const lerCofre = async (cliente: RestApiClient, id: string): Promise<RegistroCofre> => {
  try {
    const registro = paraRegistro(extrairRegistro(await cliente.get(`/rest/cofres/${id}`, { query: { depth: 0 } })));

    if (registro === null) {
      throw new Error('Cofre não encontrado.');
    }

    return registro;
  } catch (erro) {
    if (erro instanceof RestApiClientError && (erro.status === 403 || erro.status === 404)) {
      throw new Error('Você não tem acesso a este cofre.');
    }

    throw erro;
  }
};

// Confere antes (ninguém mexeu desde a leitura) e depois (ninguém gravou por cima entre conferir e gravar),
// porque a REST do IntegraCore não tem atualização condicional.
export const gravarCofre = async (
  cliente: RestApiClient,
  id: string,
  conteudoCifrado: string,
  updatedAtEsperado: string | null,
): Promise<RegistroCofre> => {
  const atual = await lerCofre(cliente, id);

  if (atual.updatedAt !== updatedAtEsperado) {
    throw new ConflitoCofreError();
  }

  await cliente.patch(`/rest/cofres/${id}`, { conteudoCifrado });

  const gravado = await lerCofre(cliente, id);

  if (gravado.conteudoCifrado !== conteudoCifrado) {
    throw new ConflitoCofreError();
  }

  return gravado;
};
