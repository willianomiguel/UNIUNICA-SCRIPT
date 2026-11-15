import { type WikiDocument } from 'src/modules/docs/types/wiki-document';

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const asString = (value: unknown): string | null =>
  typeof value === 'string' ? value : null;

// Aceita a resposta da API REST ({ data: { documentos: [...] } }) ou uma lista crua.
export const parseWikiDocuments = (payload: unknown): WikiDocument[] => {
  const root = asRecord(payload);
  const list: unknown = Array.isArray(payload)
    ? payload
    : (asRecord(root?.data)?.documentos ?? root?.documentos);

  if (!Array.isArray(list)) {
    return [];
  }

  return list.flatMap((item): WikiDocument[] => {
    const record = asRecord(item);
    const id = asString(record?.id);

    if (record === null || id === null) {
      return [];
    }

    const conteudo = asRecord(record.conteudo);
    const ordem = Number(record.ordem);

    return [
      {
        id,
        titulo: asString(record.titulo)?.trim() || 'Sem título',
        categoria: asString(record.categoria) ?? 'OUTRO',
        status: asString(record.status) ?? 'RASCUNHO',
        fixado: record.fixado === true,
        ordem: Number.isFinite(ordem) ? ordem : 0,
        documentoPaiId: asString(record.documentoPaiId),
        conteudoMarkdown: asString(conteudo?.markdown) ?? '',
        updatedAt: asString(record.updatedAt),
      },
    ];
  });
};
