import { type RequisicaoRota } from 'src/modules/trafego/types/requisicao-rota';

// Sem token configurado o endpoint é aberto; com token, exige cabeçalho x-trafego-token ou ?token=.
export const tokenIngestaoValido = (
  requisicao: RequisicaoRota,
  tokenEsperado: string | undefined,
): boolean => {
  const esperado = (tokenEsperado ?? '').trim();

  if (esperado === '') {
    return true;
  }

  const recebido =
    requisicao.headers?.['x-trafego-token'] ??
    requisicao.queryStringParameters?.token ??
    '';

  return recebido.trim() === esperado;
};
