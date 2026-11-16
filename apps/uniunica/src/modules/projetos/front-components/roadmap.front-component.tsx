import { useCallback, useEffect, useMemo, useState } from 'react';
import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineFrontComponent } from 'twenty-sdk/define';
import { AppPath, navigate } from 'twenty-sdk/front-component';
import { Callout } from 'twenty-ui/components/feedback';
import { LightButton } from 'twenty-ui/components/input';
import { IconAlertTriangle, IconMap, IconRefresh } from 'twenty-ui/icon';
import { Tag } from 'twenty-ui/primitives/data-display';
import { Loader } from 'twenty-ui/primitives/feedback';
import { Text } from 'twenty-ui/primitives/typography';
import { useTheme } from 'twenty-ui/theme';

import { PROJETO_STATUS_COLORS } from 'src/modules/projetos/constants/projeto-status-colors';
import { PROJETO_STATUS_LABELS } from 'src/modules/projetos/constants/projeto-status-labels';
import { ROADMAP_FRONT_COMPONENT_ID } from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { type ProjetoRecord } from 'src/modules/projetos/types/projeto-record';
import { type RoadmapRange } from 'src/modules/projetos/types/roadmap-range';
import { type TimelineSegment } from 'src/modules/projetos/types/timeline-segment';
import { buildMonthSegments } from 'src/modules/projetos/utils/build-month-segments.util';
import { buildQuarterSegments } from 'src/modules/projetos/utils/build-quarter-segments.util';
import { computeBarPosition } from 'src/modules/projetos/utils/compute-bar-position.util';
import { computeRoadmapRange } from 'src/modules/projetos/utils/compute-roadmap-range.util';
import { dateToPercent } from 'src/modules/projetos/utils/date-to-percent.util';
import { fetchAllRestRecords } from 'src/modules/projetos/utils/fetch-all-rest-records.util';
import { formatDatePt } from 'src/modules/projetos/utils/format-date-pt.util';
import { groupProjetosByArea } from 'src/modules/projetos/utils/group-projetos-by-area.util';
import { toUtcDay } from 'src/modules/projetos/utils/to-utc-day.util';
import { Titulo } from 'src/modules/shared/components/titulo';

const LABEL_COLUMN_WIDTH = 260;
const MONTH_MIN_WIDTH = 120;
const ROW_HEIGHT = 40;

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; projetos: ProjetoRecord[] };

const openProjeto = (projetoId: string) =>
  navigate(AppPath.RecordShowPage, {
    objectNameSingular: 'projeto',
    objectRecordId: projetoId,
  });

const statusColor = (status: string | null | undefined) =>
  PROJETO_STATUS_COLORS[status ?? ''] ?? 'gray';

const GridLines = ({
  months,
  todayPercent,
}: {
  months: TimelineSegment[];
  todayPercent: number | null;
}) => {
  const theme = useTheme();

  return (
    <>
      {months.map((month) => (
        <div
          key={month.key}
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${month.leftPercent}%`,
            borderLeft: `1px solid ${theme.border.color.light}`,
          }}
        />
      ))}
      {todayPercent !== null && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${todayPercent}%`,
            borderLeft: `2px solid ${theme.color.red}`,
            zIndex: 2,
          }}
        />
      )}
    </>
  );
};

const ProjetoBar = ({
  projeto,
  range,
}: {
  projeto: ProjetoRecord;
  range: RoadmapRange;
}) => {
  const theme = useTheme();
  const position = computeBarPosition(projeto.dataInicio, projeto.dataFim, range);

  if (position === null) {
    return null;
  }

  const color = statusColor(projeto.status);
  const progresso = Math.min(100, Math.max(0, projeto.progresso ?? 0));
  const nome = projeto.nome ?? 'Sem nome';
  const periodo = `${formatDatePt(projeto.dataInicio)} → ${formatDatePt(projeto.dataFim)}`;
  const statusLabel = PROJETO_STATUS_LABELS[projeto.status ?? ''] ?? 'Sem status';

  return (
    <button
      type="button"
      onClick={() => openProjeto(projeto.id)}
      title={`${nome} · ${statusLabel} · ${periodo} · ${progresso}%`}
      aria-label={`Abrir projeto ${nome} (${statusLabel}, ${periodo}, ${progresso}% concluído)`}
      style={{
        position: 'absolute',
        top: '7px',
        height: `${ROW_HEIGHT - 14}px`,
        left: `${position.leftPercent}%`,
        width: `${position.widthPercent}%`,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: `0 ${theme.spacing[2]}`,
        border: `1px solid ${theme.tag.text[color]}`,
        borderLeftWidth: position.isClippedStart ? '1px' : '3px',
        borderRadius: theme.border.radius.sm,
        background: theme.tag.background[color],
        color: theme.tag.text[color],
        fontFamily: theme.font.family,
        fontSize: theme.font.size.sm,
        fontWeight: theme.font.weight.medium,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        zIndex: 3,
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: '3px',
          width: `${progresso}%`,
          background: theme.tag.text[color],
          opacity: 0.6,
        }}
      />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {nome}
        {progresso > 0 ? ` · ${progresso}%` : ''}
      </span>
    </button>
  );
};

const Roadmap = () => {
  const theme = useTheme();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);
  const todayMs = useMemo(() => toUtcDay(new Date()), [reloadKey]);

  useEffect(() => {
    let isCancelled = false;

    setState({ status: 'loading' });

    fetchAllRestRecords<ProjetoRecord>(new RestApiClient(), 'projetos', {
      order_by: 'dataInicio[AscNullsLast]',
    })
      .then((projetos) => {
        if (!isCancelled) {
          setState({ status: 'ready', projetos });
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Erro desconhecido',
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const projetos = state.status === 'ready' ? state.projetos : [];
  const range = useMemo(() => computeRoadmapRange(projetos, todayMs), [projetos, todayMs]);
  const months = useMemo(() => buildMonthSegments(range), [range]);
  const quarters = useMemo(() => buildQuarterSegments(range), [range]);
  const groups = useMemo(() => groupProjetosByArea(projetos), [projetos]);
  const todayPercent =
    todayMs >= range.startMs && todayMs < range.endMs ? dateToPercent(todayMs, range) : null;
  const semDatas = projetos.filter(
    (projeto) => computeBarPosition(projeto.dataInicio, projeto.dataFim, range) === null,
  );

  const stickyLabelCell = {
    position: 'sticky' as const,
    left: 0,
    zIndex: 4,
    boxSizing: 'border-box' as const,
    background: theme.background.primary,
    borderRight: `1px solid ${theme.border.color.medium}`,
  };

  const timelineMinWidth = `${LABEL_COLUMN_WIDTH + months.length * MONTH_MIN_WIDTH}px`;

  const renderBody = () => {
    if (state.status === 'loading') {
      return (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '240px', gap: theme.spacing[2] }}>
          <Loader />
          <Text color="tertiary">Carregando projetos…</Text>
        </div>
      );
    }

    if (state.status === 'error') {
      return (
        <Callout
          status="error"
          icon={<IconAlertTriangle size={16} />}
          title="Não foi possível carregar o Roadmap"
          description={state.message}
          action={
            <LightButton size="sm" startIcon={<IconRefresh size={14} />} onClick={reload}>
              Tentar de novo
            </LightButton>
          }
        />
      );
    }

    if (projetos.length === 0) {
      return (
        <Callout
          status="info"
          icon={<IconMap size={16} />}
          title="Nenhum projeto ainda"
          description="Crie projetos com data de início e fim no menu Projetos para vê-los aqui na linha do tempo."
        />
      );
    }

    return (
      <div
        style={{
          minHeight: 0,
          overflow: 'auto',
          border: `1px solid ${theme.border.color.medium}`,
          borderRadius: theme.border.radius.md,
        }}
      >
        <div style={{ minWidth: timelineMinWidth, position: 'relative' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `${LABEL_COLUMN_WIDTH}px minmax(0, 1fr)`,
              position: 'sticky',
              top: 0,
              zIndex: 5,
              background: theme.background.secondary,
              borderBottom: `1px solid ${theme.border.color.medium}`,
            }}
          >
            <div
              style={{
                ...stickyLabelCell,
                background: theme.background.secondary,
                display: 'flex',
                alignItems: 'flex-end',
                padding: theme.spacing[2],
              }}
            >
              <Text size="sm" weight="medium" color="secondary">
                Projeto
              </Text>
            </div>
            <div>
              <div style={{ position: 'relative', height: '24px' }}>
                {quarters.map((quarter) => (
                  <div
                    key={quarter.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: `${quarter.leftPercent}%`,
                      width: `${quarter.widthPercent}%`,
                      boxSizing: 'border-box',
                      borderLeft: `1px solid ${theme.border.color.medium}`,
                      padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                      fontSize: theme.font.size.xs,
                      fontWeight: theme.font.weight.semiBold,
                      color: theme.font.color.secondary,
                    }}
                  >
                    {quarter.label}
                  </div>
                ))}
              </div>
              <div style={{ position: 'relative', height: '24px' }}>
                {months.map((month) => (
                  <div
                    key={month.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: `${month.leftPercent}%`,
                      width: `${month.widthPercent}%`,
                      boxSizing: 'border-box',
                      borderLeft: `1px solid ${theme.border.color.light}`,
                      padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                      fontSize: theme.font.size.xs,
                      color: theme.font.color.tertiary,
                    }}
                  >
                    {month.label}
                  </div>
                ))}
                {todayPercent !== null && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: `${todayPercent}%`,
                      transform: 'translateX(-50%)',
                      padding: `0 ${theme.spacing[1]}`,
                      borderRadius: theme.border.radius.sm,
                      background: theme.color.red,
                      color: theme.font.color.inverted,
                      fontSize: theme.font.size.xs,
                      fontWeight: theme.font.weight.semiBold,
                      zIndex: 3,
                    }}
                  >
                    hoje
                  </div>
                )}
              </div>
            </div>
          </div>

          {groups.map((group) => (
            <div key={group.area}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `${LABEL_COLUMN_WIDTH}px minmax(0, 1fr)`,
                  background: theme.background.tertiary,
                  borderBottom: `1px solid ${theme.border.color.light}`,
                }}
              >
                <div
                  style={{
                    ...stickyLabelCell,
                    background: theme.background.tertiary,
                    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                  }}
                >
                  <Text size="sm" weight="semibold">
                    {group.label} · {group.projetos.length}
                  </Text>
                </div>
                <div style={{ position: 'relative' }}>
                  <GridLines months={months} todayPercent={todayPercent} />
                </div>
              </div>
              {group.projetos.map((projeto) => (
                <div
                  key={projeto.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `${LABEL_COLUMN_WIDTH}px minmax(0, 1fr)`,
                    height: `${ROW_HEIGHT}px`,
                    borderBottom: `1px solid ${theme.border.color.light}`,
                  }}
                >
                  <div
                    style={{
                      ...stickyLabelCell,
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing[2],
                      padding: `0 ${theme.spacing[2]}`,
                      minWidth: 0,
                    }}
                  >
                    <LightButton
                      size="sm"
                      onClick={() => openProjeto(projeto.id)}
                      style={{ minWidth: 0, maxWidth: '100%', justifyContent: 'flex-start' }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {projeto.nome ?? 'Sem nome'}
                      </span>
                    </LightButton>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <GridLines months={months} todayPercent={todayPercent} />
                    <ProjetoBar projeto={projeto} range={range} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main
      style={{
        boxSizing: 'border-box',
        display: 'grid',
        gap: theme.spacing[3],
        gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
        height: '100%',
        minHeight: '100%',
        width: '100%',
        overflow: 'hidden',
        padding: theme.spacing[4],
        color: theme.font.color.primary,
        fontFamily: theme.font.family,
      }}
    >
      <Titulo
        nivel="pagina"
        titulo="Roadmap"
        descricao={`Projetos por área ao longo dos trimestres · hoje é ${formatDatePt(todayMs)} · clique numa barra para abrir o projeto`}
        acoes={
          <LightButton
            size="sm"
            startIcon={<IconRefresh size={14} />}
            onClick={reload}
            disabled={state.status === 'loading'}
          >
            Atualizar
          </LightButton>
        }
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing[2], alignItems: 'center' }}>
        <Text size="sm" color="tertiary">
          Status:
        </Text>
        {Object.entries(PROJETO_STATUS_LABELS).map(([value, label]) => (
          <Tag key={value} color={statusColor(value)}>
            {label}
          </Tag>
        ))}
      </div>

      {renderBody()}

      {state.status === 'ready' && semDatas.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing[1], alignItems: 'center' }}>
          <Text size="sm" color="tertiary">
            Sem datas no período ({semDatas.length}):
          </Text>
          {semDatas.map((projeto) => (
            <LightButton key={projeto.id} size="sm" onClick={() => openProjeto(projeto.id)}>
              {projeto.nome ?? 'Sem nome'}
            </LightButton>
          ))}
        </div>
      ) : (
        <div />
      )}
    </main>
  );
};

export default defineFrontComponent({
  universalIdentifier: ROADMAP_FRONT_COMPONENT_ID,
  name: 'roadmap',
  description: 'Linha do tempo (Gantt) dos projetos por área, colorida por status',
  component: Roadmap,
});
