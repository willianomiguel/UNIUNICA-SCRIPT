import { useTheme } from 'integra-ui/theme';

import { parseMarkdownInline } from 'src/modules/docs/utils/parse-markdown-inline.util';

type MarkdownInlineProps = { text: string };

export const MarkdownInline = ({ text }: MarkdownInlineProps) => {
  const theme = useTheme();

  return (
    <>
      {parseMarkdownInline(text).map((segment, index) => {
        if (segment.code === true) {
          return (
            <code
              key={index}
              style={{
                background: theme.background.tertiary,
                borderRadius: theme.border.radius.sm,
                fontFamily: 'monospace',
                padding: `0 ${theme.spacing[1]}`,
              }}
            >
              {segment.text}
            </code>
          );
        }

        if (segment.href !== undefined) {
          return (
            <a
              key={index}
              href={segment.href}
              target="_blank"
              rel="noreferrer"
              style={{ color: theme.color.blue }}
            >
              {segment.text}
            </a>
          );
        }

        if (segment.bold === true) {
          return <strong key={index}>{segment.text}</strong>;
        }

        if (segment.italic === true) {
          return <em key={index}>{segment.text}</em>;
        }

        return <span key={index}>{segment.text}</span>;
      })}
    </>
  );
};
