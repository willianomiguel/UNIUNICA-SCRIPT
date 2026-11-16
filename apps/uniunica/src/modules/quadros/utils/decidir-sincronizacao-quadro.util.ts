export type DecisaoSincronizacao = 'nada' | 'recarregar' | 'avisar';

// Chamado quando a checagem periódica lê o updatedAt do servidor.
// Sem edição local pendente, recarrega direto; com edição pendente, só avisa (não perde nada).
export const decidirSincronizacaoQuadro = ({
  updatedAtServidor,
  updatedAtConhecido,
  temEdicaoPendente,
  interagindo,
}: {
  updatedAtServidor: string | null;
  updatedAtConhecido: string | null;
  temEdicaoPendente: boolean;
  interagindo: boolean;
}): DecisaoSincronizacao => {
  if (updatedAtServidor === null || updatedAtServidor === updatedAtConhecido || interagindo) {
    return 'nada';
  }

  return temEdicaoPendente ? 'avisar' : 'recarregar';
};
