import { type ReactNode } from 'react';
import { useTheme } from 'twenty-ui/theme';

import { FONTE_TITULO } from 'src/modules/shared/constants/estilo-pagina';

// Título no estilo caderno: serifa grande para a página, menor para cada seção.
// Descrição em texto fraco embaixo; ações à direita (quebram para baixo em tela estreita).
export const Titulo = ({
  titulo,
  descricao,
  acoes,
  nivel = 'secao',
}: {
  titulo: ReactNode;
  descricao?: ReactNode;
  acoes?: ReactNode;
  nivel?: 'pagina' | 'secao';
}) => {
  const theme = useTheme();
  const pagina = nivel === 'pagina';

  return (
    <header
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: pagina ? 'flex-end' : 'baseline',
        justifyContent: 'space-between',
        gap: theme.spacing[3],
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1], minWidth: 0 }}>
        <span
          role="heading"
          aria-level={pagina ? 1 : 2}
          style={{
            fontFamily: FONTE_TITULO,
            fontSize: pagina ? '30px' : '20px',
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            color: theme.font.color.primary,
            overflowWrap: 'anywhere',
          }}
        >
          {titulo}
        </span>
        {descricao !== undefined ? (
          <span style={{ fontSize: theme.font.size.sm, color: theme.font.color.tertiary }}>{descricao}</span>
        ) : null}
      </div>
      {acoes !== undefined ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing[2] }}>
          {acoes}
        </div>
      ) : null}
    </header>
  );
};
