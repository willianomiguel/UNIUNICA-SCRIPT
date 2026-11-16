import { useTheme } from 'twenty-ui/theme';

import { FONTE_NUMEROS } from 'src/modules/shared/constants/estilo-pagina';
import { type IndicadorPainel } from 'src/modules/shared/types/indicador-painel';

// Os números mais importantes do painel (até 4), numa faixa única dividida por linhas finas,
// com o valor em fonte de números (estilo caderno, sem cartões soltos).
export const IndicadoresPrincipais = ({
  itens,
  rotulo,
}: {
  itens: IndicadorPainel[];
  rotulo: string;
}) => {
  const theme = useTheme();
  const corDoTom = (tom: IndicadorPainel['tom']) =>
    tom === 'positivo'
      ? theme.color.green
      : tom === 'negativo'
        ? theme.color.red
        : theme.font.color.tertiary;

  return (
    <section
      aria-label={rotulo}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(190px, 100%), 1fr))',
        gap: '1px',
        background: theme.border.color.medium,
        border: `1px solid ${theme.border.color.medium}`,
        borderRadius: theme.border.radius.md,
        overflow: 'hidden',
        // Painéis com altura fixa (TAB_VIEWPORT) são colunas flex; sem isto, o overflow acima
        // deixa o navegador encolher a faixa até sumir.
        flexShrink: 0,
      }}
    >
      {itens.map((item) => (
        <div
          key={item.titulo}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing[1],
            padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
            background: theme.background.primary,
            minWidth: 0,
          }}
        >
          <span style={{ fontSize: theme.font.size.sm, color: theme.font.color.tertiary }}>{item.titulo}</span>
          <span
            title={item.valor}
            style={{
              fontFamily: FONTE_NUMEROS,
              fontSize: '22px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              color: theme.font.color.primary,
              overflowWrap: 'anywhere',
            }}
          >
            {item.valor}
          </span>
          {item.detalhe !== undefined ? (
            <span style={{ fontSize: theme.font.size.sm, color: corDoTom(item.tom) }}>{item.detalhe}</span>
          ) : null}
        </div>
      ))}
    </section>
  );
};
