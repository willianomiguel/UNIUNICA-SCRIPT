import { AppPath, navigate } from 'integra-sdk/front-component';
import { LightButton } from 'integra-ui/components/input';
import { IconPencil, IconPin } from 'integra-ui/icon';
import { Tag } from 'integra-ui/primitives/data-display';
import { Heading, Text } from 'integra-ui/primitives/typography';
import { useTheme } from 'integra-ui/theme';

import { DOCUMENTO_CATEGORIAS } from 'src/modules/docs/constants/documento-categorias';
import { DOCUMENTO_STATUS_LABELS } from 'src/modules/docs/constants/documento-status-labels';
import { MarkdownContent } from 'src/modules/docs/front-components/components/MarkdownContent';
import { type WikiDocument } from 'src/modules/docs/types/wiki-document';
import { type WikiTreeNode } from 'src/modules/docs/types/wiki-tree-node';

type WikiDocumentViewProps = {
  document: WikiDocument;
  breadcrumb: WikiDocument[];
  subdocuments: WikiTreeNode[];
  onSelect: (id: string) => void;
};

const STATUS_COLOR = { RASCUNHO: 'yellow', PUBLICADO: 'green', ARQUIVADO: 'gray' } as const;

const formatDate = (value: string | null): string | null => {
  if (value === null) {
    return null;
  }
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('pt-BR');
};

export const WikiDocumentView = ({
  document,
  breadcrumb,
  subdocuments,
  onSelect,
}: WikiDocumentViewProps) => {
  const theme = useTheme();
  const categoria = DOCUMENTO_CATEGORIAS.find((item) => item.value === document.categoria);
  const statusColor =
    STATUS_COLOR[document.status as keyof typeof STATUS_COLOR] ?? 'gray';
  const updatedAt = formatDate(document.updatedAt);

  const openRecord = () =>
    navigate(AppPath.RecordShowPage, {
      objectNameSingular: 'documento',
      objectRecordId: document.id,
    });

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[4],
        margin: '0 auto',
        maxWidth: '820px',
        width: '100%',
      }}
    >
      {breadcrumb.length > 0 ? (
        <nav aria-label="Caminho do documento" style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing[1] }}>
          {breadcrumb.map((ancestor) => (
            <span key={ancestor.id} style={{ display: 'flex', gap: theme.spacing[1] }}>
              <LightButton size="sm" variant="link" onClick={() => onSelect(ancestor.id)}>
                {ancestor.titulo}
              </LightButton>
              <Text color="light">/</Text>
            </span>
          ))}
        </nav>
      ) : null}

      <header style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
        <div style={{ alignItems: 'flex-start', display: 'flex', gap: theme.spacing[3], justifyContent: 'space-between' }}>
          <Heading level={1} size="xl" style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
            {document.titulo}
          </Heading>
          <LightButton startIcon={<IconPencil size={16} />} onClick={openRecord}>
            Editar
          </LightButton>
        </div>
        <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: theme.spacing[2] }}>
          {document.fixado ? (
            <Tag color="amber" variant="soft" startIcon={<IconPin size={12} />}>
              Fixado
            </Tag>
          ) : null}
          <Tag color={categoria?.color ?? 'gray'} variant="soft">
            {categoria?.label ?? document.categoria}
          </Tag>
          <Tag color={statusColor} variant="outline">
            {DOCUMENTO_STATUS_LABELS[document.status] ?? document.status}
          </Tag>
          {updatedAt !== null ? (
            <Text size="sm" color="tertiary">Atualizado em {updatedAt}</Text>
          ) : null}
        </div>
      </header>

      <hr style={{ border: 0, borderTop: `1px solid ${theme.border.color.light}`, margin: 0, width: '100%' }} />

      <MarkdownContent markdown={document.conteudoMarkdown} />

      {subdocuments.length > 0 ? (
        <section style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2], marginTop: theme.spacing[4] }}>
          <Heading level={2} size="md">Subdocumentos</Heading>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing[2] }}>
            {subdocuments.map((child) => (
              <LightButton key={child.document.id} variant="outline" size="sm" onClick={() => onSelect(child.document.id)}>
                {child.document.titulo}
              </LightButton>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
};
