export const mensagemDeErro = (erro: unknown): string => {
  if (erro instanceof Error) {
    return erro.message;
  }

  return typeof erro === 'string' ? erro : JSON.stringify(erro) ?? 'Erro desconhecido';
};
