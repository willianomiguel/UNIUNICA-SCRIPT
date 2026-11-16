// Subconjunto do RestApiClient usado pelo módulo (facilita testes com dublês).
export type RestClientLike = {
  get<T = unknown>(
    path: string,
    options?: { query?: Record<string, string | number | boolean | null | undefined> },
  ): Promise<T>;
  post<T = unknown>(path: string, body?: unknown): Promise<T>;
  patch<T = unknown>(path: string, body?: unknown): Promise<T>;
};
