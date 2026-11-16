import { useMemo, useState } from 'react';
import { RestApiClient } from 'integra-client-sdk/rest';
import { defineFrontComponent } from 'integra-sdk/define';
import { AppPath, enqueueSnackbar, navigate } from 'integra-sdk/front-component';
import { Callout } from 'integra-ui/components/feedback';
import { LightButton, MainButton } from 'integra-ui/components/input';
import { IconPlus, IconRefresh, IconSearch } from 'integra-ui/icon';
import { Loader } from 'integra-ui/primitives/feedback';
import { Input } from 'integra-ui/primitives/input';
import { Heading, Text } from 'integra-ui/primitives/typography';
import { useTheme } from 'integra-ui/theme';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';
import { WikiDocumentView } from 'src/modules/docs/front-components/components/WikiDocumentView';
import { WikiTreeItem } from 'src/modules/docs/front-components/components/WikiTreeItem';
import { useWikiDocuments } from 'src/modules/docs/front-components/hooks/use-wiki-documents';
import { buildWikiTree } from 'src/modules/docs/utils/build-wiki-tree.util';
import { filterWikiTree } from 'src/modules/docs/utils/filter-wiki-tree.util';
import { findWikiTreeNode } from 'src/modules/docs/utils/find-wiki-tree-node.util';
import { getWikiBreadcrumb } from 'src/modules/docs/utils/get-wiki-breadcrumb.util';
import { groupWikiTree } from 'src/modules/docs/utils/group-wiki-tree.util';

const WikiPage = () => {
  const theme = useTheme();
  const wiki = useWikiDocuments();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);

  const tree = useMemo(() => buildWikiTree(wiki.documents), [wiki.documents]);
  const groups = useMemo(() => groupWikiTree(filterWikiTree(tree, query)), [tree, query]);

  const effectiveSelectedId =
    selectedId !== null && wiki.documents.some((document) => document.id === selectedId)
      ? selectedId
      : (groups[0]?.nodes[0]?.document.id ?? null);
  const selectedNode =
    effectiveSelectedId !== null ? findWikiTreeNode(tree, effectiveSelectedId) : null;

  const toggle = (id: string) =>
    setCollapsedIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });

  const createDocument = async () => {
    setIsCreating(true);
    try {
      const response = await new RestApiClient().post<{
        data?: { createDocumento?: { id?: string } };
      }>('/rest/documentos', {
        titulo: 'Novo documento',
        status: 'RASCUNHO',
        documentoPaiId: effectiveSelectedId,
      });
      const id = response.data?.createDocumento?.id;

      if (id !== undefined) {
        navigate(AppPath.RecordShowPage, { objectNameSingular: 'documento', objectRecordId: id });
      } else {
        await wiki.reload();
      }
    } catch {
      await enqueueSnackbar({ message: 'Não foi possível criar o documento', variant: 'error' });
    } finally {
      setIsCreating(false);
    }
  };

  const isSearching = query.trim() !== '';

  return (
    <main
      style={{
        boxSizing: 'border-box',
        color: theme.font.color.primary,
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 300px) minmax(0, 1fr)',
        height: '100%',
        minHeight: '100%',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <aside
        aria-label="Árvore de documentos"
        style={{
          borderRight: `1px solid ${theme.border.color.light}`,
          display: 'grid',
          gridTemplateRows: 'auto auto minmax(0, 1fr)',
          minHeight: 0,
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: theme.spacing[2], justifyContent: 'space-between', padding: `${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[2]}` }}>
          <Heading level={1} size="lg">Wiki</Heading>
          <div style={{ display: 'flex', gap: theme.spacing[1] }}>
            <LightButton
              size="sm"
              aria-label="Atualizar"
              startIcon={<IconRefresh size={14} />}
              onClick={() => void wiki.reload()}
            />
            <MainButton
              size="sm"
              startIcon={<IconPlus size={14} />}
              loading={isCreating}
              disabled={isCreating}
              onClick={() => void createDocument()}
            >
              Novo
            </MainButton>
          </div>
        </div>
        <div style={{ padding: `0 ${theme.spacing[3]} ${theme.spacing[2]}` }}>
          <label style={{ alignItems: 'center', display: 'flex', gap: theme.spacing[2] }}>
            <span aria-hidden="true" style={{ color: theme.font.color.tertiary, display: 'flex' }}>
              <IconSearch size={14} />
            </span>
            <Input
              aria-label="Buscar documentos"
              placeholder="Buscar por título…"
              value={query}
              onValueChange={(value: string) => setQuery(value)}
              size="sm"
            />
          </label>
        </div>
        <nav style={{ minHeight: 0, overflowY: 'auto', padding: `0 ${theme.spacing[2]} ${theme.spacing[4]}` }}>
          {wiki.status === 'loading' && wiki.documents.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing[6] }}>
              <Loader />
            </div>
          ) : groups.length === 0 ? (
            <div style={{ padding: theme.spacing[3] }}>
              <Text color="tertiary" size="sm">
                {isSearching ? 'Nenhum documento encontrado para essa busca.' : 'Nenhum documento ainda.'}
              </Text>
            </div>
          ) : (
            groups.map((group) => (
              <section key={group.key} style={{ marginTop: theme.spacing[3] }}>
                <div style={{ padding: `0 ${theme.spacing[2]} ${theme.spacing[1]}` }}>
                  <Text size="xs" weight="medium" color="light">
                    {group.label.toUpperCase()}
                  </Text>
                </div>
                <ul style={{ margin: 0, padding: 0 }}>
                  {group.nodes.map((node) => (
                    <WikiTreeItem
                      key={`${group.key}-${node.document.id}`}
                      node={node}
                      depth={0}
                      selectedId={effectiveSelectedId}
                      collapsedIds={collapsedIds}
                      forceExpanded={isSearching}
                      onSelect={setSelectedId}
                      onToggle={toggle}
                    />
                  ))}
                </ul>
              </section>
            ))
          )}
        </nav>
      </aside>

      <section style={{ minHeight: 0, minWidth: 0, overflowY: 'auto', padding: theme.spacing[6] }}>
        {wiki.status === 'error' ? (
          <div style={{ marginBottom: theme.spacing[4] }}>
            <Callout
              status="error"
              title="Não foi possível carregar a wiki"
              description={wiki.message}
              action={<LightButton size="sm" onClick={() => void wiki.reload()}>Tentar de novo</LightButton>}
            />
          </div>
        ) : null}
        {selectedNode !== null ? (
          <WikiDocumentView
            document={selectedNode.document}
            breadcrumb={getWikiBreadcrumb(selectedNode.document.id, wiki.documents)}
            subdocuments={selectedNode.children}
            onSelect={setSelectedId}
          />
        ) : wiki.status === 'ready' ? (
          <Callout
            title="A wiki está vazia"
            description="Crie o primeiro documento com o botão “Novo”."
          />
        ) : null}
      </section>
    </main>
  );
};

export default defineFrontComponent({
  universalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.wiki.frontComponent,
  name: 'wiki',
  description: 'Wiki da IntegraCore: árvore de documentos e leitura do conteúdo.',
  component: WikiPage,
});
