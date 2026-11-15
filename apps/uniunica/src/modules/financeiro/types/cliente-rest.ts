// Subconjunto do RestApiClient usado pelos utilitários (facilita testes).
export type ClienteRest = {
  get: <TResponse = unknown>(
    path: string,
    options?: {
      query?: Record<string, string | number | boolean | null | undefined>;
    },
  ) => Promise<TResponse>;
  post: <TResponse = unknown>(path: string, body?: unknown) => Promise<TResponse>;
  patch: <TResponse = unknown>(
    path: string,
    body?: unknown,
  ) => Promise<TResponse>;
};
