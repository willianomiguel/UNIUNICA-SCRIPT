import { Text } from 'integra-ui/primitives/typography';
import { useTheme } from 'integra-ui/theme';

import { CORES_STATUS_META } from 'src/modules/metas/constants/cores-status-meta';
import { type MetaResumo } from 'src/modules/metas/types/meta-resumo';
import { calcularTempoDecorrido } from 'src/modules/metas/utils/calcular-tempo-decorrido.util';
import { formatarValorMeta } from 'src/modules/metas/utils/formatar-valor-meta.util';

type LinhaMetaProps = {
  meta: MetaResumo;
  hoje: string;
  destaque?: boolean;
  quantidadeSubmetas?: number;
  onAbrir?: () => void;
};

// Título, status, valores e barra de progresso com o marcador do tempo decorrido.
export const LinhaMeta = ({
  meta,
  hoje,
  destaque = false,
  quantidadeSubmetas = 0,
  onAbrir,
}: LinhaMetaProps) => {
  const theme = useTheme();
  const status = CORES_STATUS_META[meta.status ?? 'NO_PRAZO'];
  const progresso = meta.progresso ?? 0;
  const decorrido = calcularTempoDecorrido(meta.dataInicio, meta.dataFim, hoje);
  const corStatus = theme.color[status.cor];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1], minWidth: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing[2],
        }}
      >
        {onAbrir ? (
          <button
            type="button"
            onClick={onAbrir}
            style={{
              all: 'unset',
              cursor: 'pointer',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: destaque ? theme.font.size.md : theme.font.size.sm,
              fontWeight: theme.font.weight.medium,
              color: theme.font.color.primary,
            }}
          >
            {meta.titulo}
          </button>
        ) : (
          <Text size={destaque ? 'md' : 'sm'} weight="medium" truncate>
            {meta.titulo}
          </Text>
        )}
        <span
          style={{
            flexShrink: 0,
            fontSize: theme.font.size.xs,
            fontWeight: theme.font.weight.medium,
            color: corStatus,
            border: `1px solid ${corStatus}`,
            borderRadius: theme.border.radius.pill,
            padding: `0 ${theme.spacing[2]}`,
          }}
        >
          {status.rotulo}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`Progresso de ${meta.titulo}`}
        aria-valuenow={Math.round(progresso)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          position: 'relative',
          height: destaque ? '10px' : '6px',
          borderRadius: theme.border.radius.pill,
          background: theme.background.tertiary,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(progresso, 100)}%`,
            borderRadius: theme.border.radius.pill,
            background: corStatus,
          }}
        />
        {decorrido !== null && decorrido < 100 && (
          <div
            aria-hidden
            title={`Tempo decorrido: ${decorrido}%`}
            style={{
              position: 'absolute',
              top: '-3px',
              bottom: '-3px',
              left: `${decorrido}%`,
              width: '2px',
              background: theme.font.color.tertiary,
            }}
          />
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: theme.spacing[2] }}>
        <Text size="xs" color="tertiary">
          {quantidadeSubmetas > 0
            ? `Média de ${quantidadeSubmetas} submeta(s)`
            : `${formatarValorMeta(meta.valorAtual, meta.unidade)} de ${formatarValorMeta(meta.valorAlvo, meta.unidade)}`}
        </Text>
        <Text size="xs" color="secondary" weight="medium">
          {progresso.toFixed(1).replace('.', ',')}%
          {decorrido !== null ? ` · tempo ${Math.round(decorrido)}%` : ''}
        </Text>
      </div>
    </div>
  );
};
