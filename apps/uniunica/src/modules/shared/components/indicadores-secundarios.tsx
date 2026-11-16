import { useTheme } from 'twenty-ui/theme';

import { FONTE_NUMEROS } from 'src/modules/shared/constants/estilo-pagina';
import { type IndicadorPainel } from 'src/modules/shared/types/indicador-painel';

// Números de apoio numa linha simples, sem moldura, abaixo dos principais.
// O tom pinta só o detalhe (como nos principais); o valor fica sempre na cor normal.
export const IndicadoresSecundarios = ({
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))',
        gap: `${theme.spacing[3]} ${theme.spacing[5]}`,
        padding: `${theme.spacing[1]} ${theme.spacing[1]} ${theme.spacing[3]}`,
        borderBottom: `1px solid ${theme.border.color.light}`,
        flexShrink: 0,
      }}
    >
      {itens.map((item) => (
        <div key={item.titulo} style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          <span style={{ fontSize: theme.font.size.xs, color: theme.font.color.tertiary }}>{item.titulo}</span>
          <span
            title={item.valor}
            style={{
              fontFamily: FONTE_NUMEROS,
              fontSize: theme.font.size.md,
              fontVariantNumeric: 'tabular-nums',
              color: theme.font.color.primary,
              overflowWrap: 'anywhere',
            }}
          >
            {item.valor}
          </span>
          {item.detalhe !== undefined ? (
            <span style={{ fontSize: theme.font.size.xs, color: corDoTom(item.tom) }}>{item.detalhe}</span>
          ) : null}
        </div>
      ))}
    </section>
  );
};
