import { type MarkdownBlock } from 'src/modules/docs/types/markdown-block';

const HEADING = /^(#{1,6})\s+(.*)$/;
const CHECK_ITEM = /^\s*[-*+]\s+\[( |x|X)\]\s+(.*)$/;
const BULLET_ITEM = /^\s*[-*+]\s+(.*)$/;
const ORDERED_ITEM = /^\s*\d+[.)]\s+(.*)$/;
const DIVIDER = /^\s*([-*_])(\s*\1){2,}\s*$/;
const QUOTE = /^\s*>\s?(.*)$/;
const FENCE = /^\s*(```|~~~)/;

// Converte markdown (o que o Twenty guarda em RICH_TEXT.markdown) em blocos simples para leitura.
export const parseMarkdownBlocks = (markdown: string): MarkdownBlock[] => {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === '') {
      index++;
      continue;
    }

    if (FENCE.test(line)) {
      const codeLines: string[] = [];

      index++;
      while (index < lines.length && !FENCE.test(lines[index])) {
        codeLines.push(lines[index]);
        index++;
      }
      index++;
      blocks.push({ type: 'code', text: codeLines.join('\n') });
      continue;
    }

    const heading = HEADING.exec(line);

    if (heading !== null) {
      const level = Math.min(heading[1].length, 4) as 1 | 2 | 3 | 4;

      blocks.push({ type: 'heading', level, text: heading[2].trim() });
      index++;
      continue;
    }

    if (DIVIDER.test(line)) {
      blocks.push({ type: 'divider' });
      index++;
      continue;
    }

    if (CHECK_ITEM.test(line)) {
      const items: Array<{ checked: boolean; text: string }> = [];
      let match: RegExpExecArray | null;

      while (index < lines.length && (match = CHECK_ITEM.exec(lines[index])) !== null) {
        items.push({ checked: match[1].toLowerCase() === 'x', text: match[2].trim() });
        index++;
      }
      blocks.push({ type: 'checklist', items });
      continue;
    }

    if (BULLET_ITEM.test(line) || ORDERED_ITEM.test(line)) {
      const ordered = !BULLET_ITEM.test(line);
      const pattern = ordered ? ORDERED_ITEM : BULLET_ITEM;
      const items: string[] = [];
      let match: RegExpExecArray | null;

      while (
        index < lines.length &&
        !CHECK_ITEM.test(lines[index]) &&
        (match = pattern.exec(lines[index])) !== null
      ) {
        items.push(match[1].trim());
        index++;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    if (QUOTE.test(line)) {
      const quoteLines: string[] = [];
      let match: RegExpExecArray | null;

      while (index < lines.length && (match = QUOTE.exec(lines[index])) !== null) {
        quoteLines.push(match[1]);
        index++;
      }
      blocks.push({ type: 'quote', text: quoteLines.join(' ').trim() });
      continue;
    }

    const paragraphLines: string[] = [];

    while (
      index < lines.length &&
      lines[index].trim() !== '' &&
      !HEADING.test(lines[index]) &&
      !FENCE.test(lines[index]) &&
      !BULLET_ITEM.test(lines[index]) &&
      !ORDERED_ITEM.test(lines[index]) &&
      !QUOTE.test(lines[index]) &&
      !DIVIDER.test(lines[index])
    ) {
      paragraphLines.push(lines[index].trim());
      index++;
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
  }

  return blocks;
};
