import { describe, expect, it } from 'vitest';

import { parseMarkdownInline } from 'src/modules/docs/utils/parse-markdown-inline.util';

describe('parseMarkdownInline', () => {
  it('separa negrito, itálico, código e links', () => {
    expect(
      parseMarkdownInline('Use **sempre** o `main`, *com cuidado* e veja [docs](https://x.y).'),
    ).toEqual([
      { text: 'Use ' },
      { text: 'sempre', bold: true },
      { text: ' o ' },
      { text: 'main', code: true },
      { text: ', ' },
      { text: 'com cuidado', italic: true },
      { text: ' e veja ' },
      { text: 'docs', href: 'https://x.y' },
      { text: '.' },
    ]);
  });

  it('retorna o texto puro quando não há marcação', () => {
    expect(parseMarkdownInline('texto simples')).toEqual([{ text: 'texto simples' }]);
    expect(parseMarkdownInline('')).toEqual([]);
  });
});
