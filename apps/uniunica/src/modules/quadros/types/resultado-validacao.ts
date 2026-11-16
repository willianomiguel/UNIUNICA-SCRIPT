export type ResultadoValidacao<T> = { ok: true; valor: T } | { ok: false; erro: string };
