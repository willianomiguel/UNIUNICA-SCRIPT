import { describe, expect, it } from 'vitest';

import { parseMarkdownBlocks } from 'src/modules/docs/utils/parse-markdown-blocks.util';

describe('parseMarkdownBlocks', () => {
  it('reconhece títulos, parágrafos, listas, checklists, citações, código e divisores', () => {
    const markdown = [
      '# Título',
      '',
      'Linha um',
      'linha dois',
      '',
      '- item a',
      '* item b',
      '',
      '1. primeiro',
      '2) segundo',
      '',
      '- [ ] pendente',
      '- [x] feito',
      '',
      '> citação',
      '> continua',
      '',
      '```',
      'yarn build',
      '```',
      '---',
      '##### pequeno',
    ].join('\n');

    expect(parseMarkdownBlocks(markdown)).toEqual([
      { type: 'heading', level: 1, text: 'Título' },
      { type: 'paragraph', text: 'Linha um linha dois' },
      { type: 'list', ordered: false, items: ['item a', 'item b'] },
      { type: 'list', ordered: true, items: ['primeiro', 'segundo'] },
      {
        type: 'checklist',
        items: [
          { checked: false, text: 'pendente' },
          { checked: true, text: 'feito' },
        ],
      },
      { type: 'quote', text: 'citação continua' },
      { type: 'code', text: 'yarn build' },
      { type: 'divider' },
      { type: 'heading', level: 4, text: 'pequeno' },
    ]);
  });

  it('retorna lista vazia para conteúdo vazio e aceita CRLF', () => {
    expect(parseMarkdownBlocks('')).toEqual([]);
    expect(parseMarkdownBlocks('a\r\nb')).toEqual([{ type: 'paragraph', text: 'a b' }]);
  });

  it('fecha bloco de código sem cerca final', () => {
    expect(parseMarkdownBlocks('```\nabc')).toEqual([{ type: 'code', text: 'abc' }]);
  });
});
