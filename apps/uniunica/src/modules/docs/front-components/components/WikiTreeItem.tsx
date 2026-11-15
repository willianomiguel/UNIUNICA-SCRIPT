import { IconChevronDown, IconChevronRight, IconFileText, IconPin } from 'twenty-ui/icon';
import { useTheme } from 'twenty-ui/theme';

import { type WikiTreeNode } from 'src/modules/docs/types/wiki-tree-node';

type WikiTreeItemProps = {
  node: WikiTreeNode;
  depth: number;
  selectedId: string | null;
  collapsedIds: Set<string>;
  forceExpanded: boolean;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
};

export const WikiTreeItem = ({
  node,
  depth,
  selectedId,
  collapsedIds,
  forceExpanded,
  onSelect,
  onToggle,
}: WikiTreeItemProps) => {
  const theme = useTheme();
  const { document, children } = node;
  const isSelected = document.id === selectedId;
  const hasChildren = children.length > 0;
  const isExpanded = forceExpanded || !collapsedIds.has(document.id);

  return (
    <li style={{ listStyle: 'none' }}>
      <div
        style={{
          alignItems: 'center',
          background: isSelected ? theme.background.transparent.medium : 'transparent',
          borderRadius: theme.border.radius.sm,
          display: 'flex',
          gap: theme.spacing[1],
          paddingLeft: `calc(${theme.spacing[4]} * ${depth})`,
        }}
      >
        <button
          type="button"
          aria-label={isExpanded ? `Recolher ${document.titulo}` : `Expandir ${document.titulo}`}
          disabled={!hasChildren}
          onClick={() => onToggle(document.id)}
          style={{
            alignItems: 'center',
            background: 'transparent',
            border: 0,
            color: theme.font.color.tertiary,
            cursor: hasChildren ? 'pointer' : 'default',
            display: 'flex',
            flexShrink: 0,
            height: '24px',
            justifyContent: 'center',
            padding: 0,
            visibility: hasChildren ? 'visible' : 'hidden',
            width: '20px',
          }}
        >
          {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
        </button>
        <button
          type="button"
          aria-current={isSelected ? 'page' : undefined}
          onClick={() => onSelect(document.id)}
          style={{
            alignItems: 'center',
            background: 'transparent',
            border: 0,
            color: isSelected ? theme.font.color.primary : theme.font.color.secondary,
            cursor: 'pointer',
            display: 'flex',
            flex: 1,
            fontFamily: theme.font.family,
            fontSize: theme.font.size.md,
            fontWeight: isSelected ? theme.font.weight.medium : theme.font.weight.regular,
            gap: theme.spacing[2],
            minWidth: 0,
            padding: `${theme.spacing[1]} ${theme.spacing[1]}`,
            textAlign: 'left',
          }}
        >
          <span aria-hidden="true" style={{ display: 'flex', flexShrink: 0 }}>
            {document.fixado ? <IconPin size={14} /> : <IconFileText size={14} />}
          </span>
          <span
            style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={document.titulo}
          >
            {document.titulo}
          </span>
          {document.status === 'RASCUNHO' ? (
            <span style={{ color: theme.font.color.light, fontSize: theme.font.size.xs, flexShrink: 0 }}>
              rascunho
            </span>
          ) : null}
        </button>
      </div>
      {hasChildren && isExpanded ? (
        <ul style={{ margin: 0, padding: 0 }}>
          {children.map((child) => (
            <WikiTreeItem
              key={child.document.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              collapsedIds={collapsedIds}
              forceExpanded={forceExpanded}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};
