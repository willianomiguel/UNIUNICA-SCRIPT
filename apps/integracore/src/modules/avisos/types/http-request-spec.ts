export type HttpRequestSpec = {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
};
