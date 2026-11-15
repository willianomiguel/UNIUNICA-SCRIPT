const API_URL = 'https://api.mercadopago.com/v1/payments';

export const buscarPagamentoMercadoPago = async (
  idPagamento: string,
  accessToken: string,
): Promise<unknown> => {
  const resposta = await fetch(`${API_URL}/${encodeURIComponent(idPagamento)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!resposta.ok) {
    throw new Error(
      `Mercado Pago respondeu ${resposta.status} ao buscar o pagamento ${idPagamento}`,
    );
  }

  return resposta.json();
};
