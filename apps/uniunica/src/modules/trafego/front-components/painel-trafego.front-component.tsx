import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { Callout } from 'twenty-ui/components/feedback';
import { IconRefresh } from 'twenty-ui/icon';
import { Tag } from 'twenty-ui/primitives/data-display';
import { Button } from 'twenty-ui/primitives/input';
import { Heading, Text } from 'twenty-ui/primitives/typography';
import { useTheme } from 'twenty-ui/theme';

import { ROTULO_PLATAFORMA } from 'src/modules/trafego/constants/trafego-constantes';
import { PAINEL_TRAFEGO_FRONT_COMPONENT_ID } from 'src/modules/trafego/constants/trafego-universal-identifiers';
import { carregarDadosPainel } from 'src/modules/trafego/services/carregar-dados-painel.service';
import { type DadosPainel } from 'src/modules/trafego/types/dados-painel';
import { agregarPorDia } from 'src/modules/trafego/utils/agregar-por-dia.util';
import { agregarPorPlataforma } from 'src/modules/trafego/utils/agregar-por-plataforma.util';
import { calcularIndicadores } from 'src/modules/trafego/utils/calcular-indicadores.util';
import { dataNoFuso } from 'src/modules/trafego/utils/data-no-fuso.util';
import { formatarMoedaBrl } from 'src/modules/trafego/utils/formatar-moeda-brl.util';
import { formatarNumero } from 'src/modules/trafego/utils/formatar-numero.util';
import { formatarPercentual } from 'src/modules/trafego/utils/formatar-percentual.util';
import { formatarRoas } from 'src/modules/trafego/utils/formatar-roas.util';
import { montarLinhasPainel } from 'src/modules/trafego/utils/montar-linhas-painel.util';
import { somarDias } from 'src/modules/trafego/utils/somar-dias.util';
import { somarMetricas } from 'src/modules/trafego/utils/somar-metricas.util';

const PERIODOS = [7, 14, 30, 90] as const;

const COR_PLATAFORMA: Record<string, string> = {
  META_ADS: 'blue',
  GOOGLE_ADS: 'red',
  TIKTOK_ADS: 'purple',
  ORGANICO: 'green',
  EMAIL: 'sky',
  INFLUENCIADOR: 'pink',
  SITE: 'green',
  MANUAL: 'gray',
  OUTRO: 'gray',
};

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'pronto'; dados: DadosPainel };

const PainelTrafego = () => {
  const theme = useTheme();
  const [dias, setDias] = useState<number>(30);
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });
  const [versao, setVersao] = useState(0);

  const hoje = dataNoFuso(new Date());
  const inicio = somarDias(hoje, -(dias - 1));

  const recarregar = useCallback(() => setVersao((valor) => valor + 1), []);

  useEffect(() => {
    let cancelado = false;

    setEstado({ tipo: 'carregando' });
    carregarDadosPainel(inicio)
      .then((dados) => {
        if (!cancelado) setEstado({ tipo: 'pronto', dados });
      })
      .catch((erro: unknown) => {
        if (!cancelado) {
          setEstado({
            tipo: 'erro',
            mensagem: erro instanceof Error ? erro.message : String(erro),
          });
        }
      });

    return () => {
      cancelado = true;
    };
  }, [inicio, versao]);

  const resumo = useMemo(() => {
    if (estado.tipo !== 'pronto') return null;

    const { campanhas, metricas, vendas } = estado.dados;
    const totais = somarMetricas(metricas);
    const linhas = montarLinhasPainel({ campanhas, metricas, vendas });
    const receita = linhas.reduce((soma, linha) => soma + linha.receita, 0);
    const quantidadeVendas = linhas.reduce((soma, linha) => soma + linha.vendas, 0);
    const plataformaPorCampanha = Object.fromEntries(
      campanhas.map((campanha) => [campanha.id, campanha.plataforma]),
    );
    const porPlataforma = Object.entries(agregarPorPlataforma(metricas, plataformaPorCampanha))
      .map(([plataforma, valores]) => ({ plataforma, valores }))
      .sort((a, b) => b.valores.gasto - a.valores.gasto);

    return {
      totais,
      receita,
      quantidadeVendas,
      indicadores: calcularIndicadores({ totais, receita, vendas: quantidadeVendas }),
      linhas,
      porDia: agregarPorDia(metricas),
      porPlataforma,
    };
  }, [estado]);

  const estilos = {
    pagina: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing[6],
      height: '100%',
      overflowY: 'auto',
      padding: theme.spacing[6],
      color: theme.font.color.primary,
      fontFamily: theme.font.family,
    },
    cabecalho: {
      alignItems: 'center',
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing[3],
      justifyContent: 'space-between',
    },
    acoes: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: theme.spacing[2] },
    kpis: {
      display: 'grid',
      gap: theme.spacing[3],
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    },
    cartao: {
      background: theme.background.secondary,
      border: `1px solid ${theme.border.color.light}`,
      borderRadius: theme.border.radius.md,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing[1],
      minWidth: 0,
      padding: theme.spacing[3],
    },
    valor: { fontSize: theme.font.size.xl, fontWeight: theme.font.weight.semiBold },
    secao: { display: 'flex', flexDirection: 'column', gap: theme.spacing[3], minWidth: 0 },
    duasColunas: {
      display: 'grid',
      gap: theme.spacing[6],
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    },
    tabelaWrapper: {
      border: `1px solid ${theme.border.color.light}`,
      borderRadius: theme.border.radius.md,
      overflowX: 'auto',
    },
    tabela: { borderCollapse: 'collapse', fontSize: theme.font.size.sm, minWidth: '900px', width: '100%' },
    th: {
      background: theme.background.secondary,
      borderBottom: `1px solid ${theme.border.color.light}`,
      color: theme.font.color.tertiary,
      fontWeight: theme.font.weight.medium,
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      textAlign: 'right',
      whiteSpace: 'nowrap',
    },
    td: {
      borderBottom: `1px solid ${theme.border.color.light}`,
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      textAlign: 'right',
      whiteSpace: 'nowrap',
    },
    grafico: {
      alignItems: 'flex-end',
      borderBottom: `1px solid ${theme.border.color.medium}`,
      display: 'flex',
      gap: '2px',
      height: '160px',
      paddingTop: theme.spacing[2],
    },
    eixo: {
      color: theme.font.color.tertiary,
      display: 'flex',
      fontSize: theme.font.size.xs,
      justifyContent: 'space-between',
    },
  } satisfies Record<string, CSSProperties>;

  const Kpi = ({ rotulo, valor, detalhe }: { rotulo: string; valor: string; detalhe?: string }) => (
    <div style={estilos.cartao}>
      <Text size="sm" color="tertiary">
        {rotulo}
      </Text>
      <span style={estilos.valor}>{valor}</span>
      {detalhe ? (
        <Text size="xs" color="light">
          {detalhe}
        </Text>
      ) : null}
    </div>
  );

  const GraficoDiario = ({
    titulo,
    valores,
    formatar,
    cor,
  }: {
    titulo: string;
    valores: Array<{ data: string; valor: number }>;
    formatar: (valor: number) => string;
    cor: string;
  }) => {
    const maximo = Math.max(...valores.map((item) => item.valor), 0);

    return (
      <section style={estilos.secao} aria-label={titulo}>
        <Heading level={3} size="md">
          {titulo}
        </Heading>
        {valores.length === 0 ? (
          <Text size="sm" color="tertiary">
            Sem dados no período.
          </Text>
        ) : (
          <>
            <div style={estilos.grafico} role="img" aria-label={`${titulo} por dia`}>
              {valores.map((item) => (
                <div
                  key={item.data}
                  title={`${item.data.split('-').reverse().join('/')}: ${formatar(item.valor)}`}
                  style={{
                    background: cor,
                    borderRadius: '3px 3px 0 0',
                    flex: '1 1 0',
                    height: maximo > 0 ? `${Math.max(2, (item.valor / maximo) * 100)}%` : '2px',
                    minWidth: '4px',
                    opacity: 0.85,
                  }}
                />
              ))}
            </div>
            <div style={estilos.eixo}>
              <span>{valores[0].data.split('-').reverse().slice(0, 2).join('/')}</span>
              <span>máx. {formatar(maximo)}</span>
              <span>
                {valores[valores.length - 1].data.split('-').reverse().slice(0, 2).join('/')}
              </span>
            </div>
          </>
        )}
      </section>
    );
  };

  return (
    <main style={estilos.pagina}>
      <header style={estilos.cabecalho}>
        <div>
          <Heading level={1} size="xl">
            Painel de Tráfego
          </Heading>
          <Text size="sm" color="tertiary">
            {inicio.split('-').reverse().join('/')} a {hoje.split('-').reverse().join('/')} · receita
            = vendas aprovadas ligadas às campanhas
          </Text>
        </div>
        <div style={estilos.acoes} role="group" aria-label="Período">
          {PERIODOS.map((periodo) => (
            <Button
              key={periodo}
              size="sm"
              variant={periodo === dias ? 'solid' : 'outline'}
              onClick={() => setDias(periodo)}
              aria-pressed={periodo === dias}
            >
              {periodo} dias
            </Button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            startIcon={<IconRefresh size={16} aria-hidden />}
            onClick={recarregar}
            loading={estado.tipo === 'carregando'}
          >
            Atualizar
          </Button>
        </div>
      </header>

      {estado.tipo === 'erro' ? (
        <Callout
          status="error"
          title="Não foi possível carregar o painel"
          description={estado.mensagem}
          action={
            <Button size="sm" variant="outline" onClick={recarregar}>
              Tentar de novo
            </Button>
          }
        />
      ) : null}

      {estado.tipo === 'carregando' && !resumo ? (
        <Text size="sm" color="tertiary">
          Carregando dados de tráfego…
        </Text>
      ) : null}

      {estado.tipo === 'pronto' && estado.dados.avisoVendas ? (
        <Callout status="warning" title="Vendas indisponíveis" description={estado.dados.avisoVendas} />
      ) : null}

      {resumo && resumo.linhas.length === 0 ? (
        <Callout
          status="info"
          title="Nenhum dado de tráfego no período"
          description="Envie métricas pelo endpoint de ingestão, configure o Meta Ads ou instale o pixel no site (veja o README do módulo de tráfego)."
        />
      ) : null}

      {resumo ? (
        <>
          <section style={estilos.kpis} aria-label="Indicadores do período">
            <Kpi rotulo="Gasto" valor={formatarMoedaBrl(resumo.totais.gasto)} />
            <Kpi
              rotulo="Cliques"
              valor={formatarNumero(resumo.totais.cliques)}
              detalhe={`CTR ${formatarPercentual(resumo.indicadores.ctr)} · CPC ${formatarMoedaBrl(resumo.indicadores.cpc)}`}
            />
            <Kpi
              rotulo="Leads"
              valor={formatarNumero(resumo.totais.leads)}
              detalhe={`CPL ${formatarMoedaBrl(resumo.indicadores.cpl)}`}
            />
            <Kpi
              rotulo="Vendas aprovadas"
              valor={formatarNumero(resumo.quantidadeVendas)}
              detalhe={`${formatarNumero(resumo.totais.conversoes)} conversões nas plataformas`}
            />
            <Kpi rotulo="Receita" valor={formatarMoedaBrl(resumo.receita)} />
            <Kpi rotulo="CPA" valor={formatarMoedaBrl(resumo.indicadores.cpa)} detalhe="gasto ÷ vendas" />
            <Kpi rotulo="ROAS" valor={formatarRoas(resumo.indicadores.roas)} detalhe="receita ÷ gasto" />
            <Kpi
              rotulo="Impressões"
              valor={formatarNumero(resumo.totais.impressoes)}
              detalhe={`CPM ${formatarMoedaBrl(resumo.indicadores.cpm)}`}
            />
          </section>

          <div style={estilos.duasColunas}>
            <GraficoDiario
              titulo="Gasto por dia"
              valores={resumo.porDia.map((item) => ({ data: item.data, valor: item.totais.gasto }))}
              formatar={formatarMoedaBrl}
              cor={theme.color.blue}
            />
            <GraficoDiario
              titulo="Cliques por dia"
              valores={resumo.porDia.map((item) => ({ data: item.data, valor: item.totais.cliques }))}
              formatar={(valor) => formatarNumero(valor)}
              cor={theme.color.turquoise}
            />
            <GraficoDiario
              titulo="Leads por dia"
              valores={resumo.porDia.map((item) => ({ data: item.data, valor: item.totais.leads }))}
              formatar={(valor) => formatarNumero(valor)}
              cor={theme.color.orange}
            />
          </div>

          <section style={estilos.secao} aria-label="Resultado por campanha">
            <Heading level={2} size="lg">
              Por campanha
            </Heading>
            <div style={estilos.tabelaWrapper}>
              <table style={estilos.tabela}>
                <thead>
                  <tr>
                    <th style={{ ...estilos.th, textAlign: 'left' }}>Campanha</th>
                    <th style={{ ...estilos.th, textAlign: 'left' }}>Plataforma</th>
                    <th style={estilos.th}>Gasto</th>
                    <th style={estilos.th}>Cliques</th>
                    <th style={estilos.th}>CTR</th>
                    <th style={estilos.th}>Leads</th>
                    <th style={estilos.th}>CPL</th>
                    <th style={estilos.th}>Vendas</th>
                    <th style={estilos.th}>Receita</th>
                    <th style={estilos.th}>CPA</th>
                    <th style={estilos.th}>ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {resumo.linhas.map((linha) => (
                    <tr key={linha.campanhaId ?? 'sem-campanha'}>
                      <td
                        style={{
                          ...estilos.td,
                          maxWidth: '280px',
                          overflow: 'hidden',
                          textAlign: 'left',
                          textOverflow: 'ellipsis',
                        }}
                        title={linha.nome}
                      >
                        {linha.nome}
                      </td>
                      <td style={{ ...estilos.td, textAlign: 'left' }}>
                        {linha.plataforma ? (
                          <Tag color={(COR_PLATAFORMA[linha.plataforma] ?? 'gray') as 'gray'}>
                            {ROTULO_PLATAFORMA[linha.plataforma] ?? linha.plataforma}
                          </Tag>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td style={estilos.td}>{formatarMoedaBrl(linha.totais.gasto)}</td>
                      <td style={estilos.td}>{formatarNumero(linha.totais.cliques)}</td>
                      <td style={estilos.td}>{formatarPercentual(linha.indicadores.ctr)}</td>
                      <td style={estilos.td}>{formatarNumero(linha.totais.leads)}</td>
                      <td style={estilos.td}>{formatarMoedaBrl(linha.indicadores.cpl)}</td>
                      <td style={estilos.td}>{formatarNumero(linha.vendas)}</td>
                      <td style={estilos.td}>{formatarMoedaBrl(linha.receita)}</td>
                      <td style={estilos.td}>{formatarMoedaBrl(linha.indicadores.cpa)}</td>
                      <td style={{ ...estilos.td, fontWeight: theme.font.weight.semiBold }}>
                        {formatarRoas(linha.indicadores.roas)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={estilos.secao} aria-label="Gasto por plataforma">
            <Heading level={2} size="lg">
              Por plataforma
            </Heading>
            {resumo.porPlataforma.map(({ plataforma, valores }) => {
              const parte = resumo.totais.gasto > 0 ? (valores.gasto / resumo.totais.gasto) * 100 : 0;

              return (
                <div key={plataforma} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1] }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: theme.spacing[2] }}>
                    <Text size="sm" weight="medium">
                      {ROTULO_PLATAFORMA[plataforma] ?? plataforma}
                    </Text>
                    <Text size="sm" color="secondary">
                      {formatarMoedaBrl(valores.gasto)} · {formatarNumero(valores.cliques)} cliques ·{' '}
                      {formatarNumero(valores.visitas)} visitas · {formatarNumero(valores.leads)} leads
                    </Text>
                  </div>
                  <div
                    style={{
                      background: theme.background.tertiary,
                      borderRadius: theme.border.radius.sm,
                      height: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ background: theme.color.blue, height: '100%', width: `${parte}%` }} />
                  </div>
                </div>
              );
            })}
          </section>
        </>
      ) : null}
    </main>
  );
};

export default defineFrontComponent({
  universalIdentifier: PAINEL_TRAFEGO_FRONT_COMPONENT_ID,
  name: 'painel-trafego',
  description:
    'Painel de Tráfego: gasto, cliques, leads, vendas, CPA e ROAS por campanha, por dia e por plataforma.',
  component: PainelTrafego,
});
