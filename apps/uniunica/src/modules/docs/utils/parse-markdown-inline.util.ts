import { type MarkdownInlineSegment } from 'src/modules/docs/types/markdown-inline-segment';

const INLINE_TOKEN =
  /(`[^`]+`)|(\*\*[^*]+\*\*|__[^_]+__)|(\*[^*\s][^*]*\*|_[^_\s][^_]*_)|(\[[^\]]+\]\([^)\s]+\))/g;

// Quebra uma linha em trechos com `código`, **negrito**, *itálico* e [links](url).
export const parseMarkdownInline = (text: string): MarkdownInlineSegment[] => {
  const segments: MarkdownInlineSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_TOKEN)) {
    const start = match.index ?? 0;
    const token = match[0];

    if (start > lastIndex) {
      segments.push({ text: text.slice(lastIndex, start) });
    }

    if (match[1] !== undefined) {
      segments.push({ text: token.slice(1, -1), code: true });
    } else if (match[2] !== undefined) {
      segments.push({ text: token.slice(2, -2), bold: true });
    } else if (match[3] !== undefined) {
      segments.push({ text: token.slice(1, -1), italic: true });
    } else {
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);

      segments.push({ text: link?.[1] ?? token, href: link?.[2] });
    }

    lastIndex = start + token.length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments;
};
