import { Heading, Text } from 'twenty-ui/primitives/typography';
import { useTheme } from 'twenty-ui/theme';

import { MarkdownInline } from 'src/modules/docs/front-components/components/MarkdownInline';
import { parseMarkdownBlocks } from 'src/modules/docs/utils/parse-markdown-blocks.util';

type MarkdownContentProps = { markdown: string };

const HEADING_SIZE = { 1: 'xl', 2: 'lg', 3: 'md', 4: 'md' } as const;

export const MarkdownContent = ({ markdown }: MarkdownContentProps) => {
  const theme = useTheme();
  const blocks = parseMarkdownBlocks(markdown);

  if (blocks.length === 0) {
    return (
      <Text color="tertiary">
        Este documento ainda não tem conteúdo. Clique em “Editar” para escrever.
      </Text>
    );
  }

  return (
    <div
      style={{
        color: theme.font.color.primary,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[3],
        fontSize: theme.font.size.md,
        lineHeight: 1.6,
      }}
    >
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <Heading
                key={index}
                level={(block.level + 1) as 2 | 3 | 4 | 5}
                size={HEADING_SIZE[block.level]}
                style={{ marginTop: theme.spacing[2] }}
              >
                <MarkdownInline text={block.text} />
              </Heading>
            );
          case 'paragraph':
            return (
              <p key={index} style={{ margin: 0 }}>
                <MarkdownInline text={block.text} />
              </p>
            );
          case 'list': {
            const items = block.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <MarkdownInline text={item} />
              </li>
            ));
            const listStyle = { margin: 0, paddingLeft: theme.spacing[6] };

            return block.ordered ? (
              <ol key={index} style={listStyle}>{items}</ol>
            ) : (
              <ul key={index} style={listStyle}>{items}</ul>
            );
          }
          case 'checklist':
            return (
              <ul key={index} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {block.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    style={{ display: 'flex', gap: theme.spacing[2], alignItems: 'baseline' }}
                  >
                    <span aria-hidden="true">{item.checked ? '☑' : '☐'}</span>
                    <span
                      style={{
                        color: item.checked ? theme.font.color.tertiary : undefined,
                        textDecoration: item.checked ? 'line-through' : undefined,
                      }}
                    >
                      <MarkdownInline text={item.text} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case 'quote':
            return (
              <blockquote
                key={index}
                style={{
                  borderLeft: `3px solid ${theme.border.color.strong}`,
                  color: theme.font.color.secondary,
                  margin: 0,
                  paddingLeft: theme.spacing[3],
                }}
              >
                <MarkdownInline text={block.text} />
              </blockquote>
            );
          case 'code':
            return (
              <pre
                key={index}
                style={{
                  background: theme.background.tertiary,
                  borderRadius: theme.border.radius.md,
                  fontFamily: 'monospace',
                  fontSize: theme.font.size.sm,
                  margin: 0,
                  overflowX: 'auto',
                  padding: theme.spacing[3],
                  whiteSpace: 'pre',
                }}
              >
                {block.text}
              </pre>
            );
          case 'divider':
            return (
              <hr
                key={index}
                style={{
                  border: 0,
                  borderTop: `1px solid ${theme.border.color.medium}`,
                  margin: 0,
                  width: '100%',
                }}
              />
            );
        }
      })}
    </div>
  );
};
