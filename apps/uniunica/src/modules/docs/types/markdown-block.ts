export type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'checklist'; items: Array<{ checked: boolean; text: string }> }
  | { type: 'quote'; text: string }
  | { type: 'code'; text: string }
  | { type: 'divider' };
