// Parte do RoutePayload que os utils de rota usam (testável sem o SDK).
export type RequisicaoRota = {
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
  body?: unknown;
};
