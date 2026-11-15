import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { AppPath, navigate } from 'twenty-sdk/front-component';
import { Callout } from 'twenty-ui/components/feedback';
import { IconAlertTriangle, IconRefresh } from 'twenty-ui/icon';
import { Tag } from 'twenty-ui/primitives/data-display';
import { Loader } from 'twenty-ui/primitives/feedback';
import { Button, ButtonGroup } from 'twenty-ui/primitives/input';
import { Heading, Text } from 'twenty-ui/primitives/typography';
import { useTheme } from 'twenty-ui/theme';

import { OBJECTS } from 'src/modules/shared/constants/objects';
import { GATEWAY_OPCOES } from 'src/modules/vendas/constants/gateway-opcoes';
import { METODO_PAGAMENTO_OPCOES } from 'src/modules/vendas/constants/metodo-pagamento-opcoes';
import { VENDA_STATUS_OPCOES } from 'src/modules/vendas/constants/venda-status-opcoes';
import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';
import { type OpcaoSelect } from 'src/modules/vendas/types/opcao-select';
import { type PeriodoPainel } from 'src/modules/vendas/types/periodo-painel';
import { type RegistroVendaApi } from 'src/modules/vendas/types/registro-venda-api';
import { type TotalAgrupado } from 'src/modules/vendas/types/total-agrupado';
import { agruparVendas } from 'src/modules/vendas/utils/agrupar-vendas.util';
import { agruparVendasPorDia } from 'src/modules/vendas/utils/agrupar-vendas-por-dia.util';
import { calcularMetricasVendas } from 'src/modules/vendas/utils/calcular-metricas-vendas.util';
import { calcularVariacao } from 'src/modules/vendas/utils/calcular-variacao.util';
import { filtrarVendasPorIntervalo } from 'src/modules/vendas/utils/filtrar-vendas-por-intervalo.util';
import { formatarMoedaBrl } from 'src/modules/vendas/utils/formatar-moeda-brl.util';
import { formatarPercentual } from 'src/modules/vendas/utils/formatar-percentual.util';
import { mapearRegistroVenda } from 'src/modules/vendas/utils/mapear-registro-venda.util';
import { mensagemDeErro } from 'src/modules/vendas/utils/mensagem-de-erro.util';
import { obterIntervaloAnterior } from 'src/modules/vendas/utils/obter-intervalo-anterior.util';
import { obterIntervaloPeriodo } from 'src/modules/vendas/utils/obter-intervalo-periodo.util';
import { rotuloOpcao } from 'src/modules/vendas/utils/rotulo-opcao.util';
import { carregarVendasPainel } from 'src/modules/vendas/vendas-client/carregar-vendas-painel';

const PERIODOS: { valor: PeriodoPainel; rotulo: string }[] = [
  { valor: 'HOJE', rotulo: 'Hoje' },
  { valor: '7D', rotulo: '7 dias' },
  { valor: '30D', rotulo: '30 dias' },
  { valor: 'MES', rotulo: 'Este mês' },
];

const DIAS_CARREGADOS = 62;

type Estado =
  | { tipo: 'CARREGANDO' }
  | { tipo: 'ERRO'; mensagem: string }
  | { tipo: 'PRONTO'; registros: RegistroVendaApi[]; carregadoEm: Date };

const formatarData = (data: Date) =>
  data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

const CartaoKpi = ({
  titulo,
  valor,
  detalhe,
  tom,
}: {
  titulo: string;
  valor: string;
  detalhe?: ReactNode;
  tom?: 'positivo' | 'negativo' | 'neutro';
}) => {
  const theme = useTheme();
  const corDetalhe =
    tom === 'positivo'
      ? theme.color.green
      : tom === 'negativo'
        ? theme.color.red
        : theme.font.color.tertiary;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[1],
        padding: theme.spacing[3],
        border: `1px solid ${theme.border.color.medium}`,
        borderRadius: theme.border.radius.md,
        background: theme.background.primary,
        minWidth: 0,
      }}
    >
      <Text size="sm" color="tertiary">
        {titulo}
      </Text>
      <span
        style={{
          fontSize: theme.font.size.xl,
          fontWeight: theme.font.weight.semiBold,
          color: theme.font.color.primary,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {valor}
      </span>
      {detalhe !== undefined && (
        <span style={{ fontSize: theme.font.size.sm, color: corDetalhe }}>{detalhe}</span>
      )}
    </div>
  );
};

const Painel = ({ titulo, children }: { titulo: string; children: ReactNode }) => {
  const theme = useTheme();

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[3],
        padding: theme.spacing[4],
        border: `1px solid ${theme.border.color.medium}`,
        borderRadius: theme.border.radius.md,
        background: theme.background.primary,
        minWidth: 0,
      }}
    >
      <Heading level={3} size="md">
        {titulo}
      </Heading>
      {children}
    </section>
  );
};

const ListaAgrupada = ({
  grupos,
  opcoes,
}: {
  grupos: TotalAgrupado<string>[];
  opcoes: OpcaoSelect<string>[];
}) => {
  const theme = useTheme();
  const maiorQuantidade = Math.max(1, ...grupos.map((grupo) => grupo.quantidade));

  if (grupos.length === 0) {
    return (
      <Text size="sm" color="tertiary">
        Nenhuma venda no período.
      </Text>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
      {grupos.map((grupo) => {
        const opcao = opcoes.find((item) => item.value === grupo.chave);

        return (
          <div key={grupo.chave} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1] }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: theme.spacing[2],
              }}
            >
              <Tag color={opcao?.color ?? 'gray'}>{rotuloOpcao(opcoes, grupo.chave)}</Tag>
              <span style={{ fontSize: theme.font.size.sm, color: theme.font.color.secondary, whiteSpace: 'nowrap' }}>
                {grupo.quantidade} · {formatarMoedaBrl(grupo.valor)}
              </span>
            </div>
            <div style={{ height: '4px', borderRadius: theme.border.radius.pill, background: theme.background.tertiary }}>
              <div
                style={{
                  width: `${(grupo.quantidade / maiorQuantidade) * 100}%`,
                  height: '100%',
                  borderRadius: theme.border.radius.pill,
                  background: theme.color[opcao?.color ?? 'gray'],
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const GraficoDiario = ({
  dias,
}: {
  dias: { dia: string; faturamento: number; pagas: number; recusadas: number }[];
}) => {
  const theme = useTheme();
  const maior = Math.max(1, ...dias.map((dia) => dia.faturamento));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
      <div
        role="img"
        aria-label="Faturamento pago por dia"
        style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '140px' }}
      >
        {dias.map((dia) => (
          <div
            key={dia.dia}
            title={`${dia.dia.split('-').reverse().join('/')}: ${formatarMoedaBrl(dia.faturamento)} · ${dia.pagas} paga(s) · ${dia.recusadas} recusa(s)`}
            style={{
              flex: '1 1 0',
              minWidth: 0,
              height: `${Math.max(2, (dia.faturamento / maior) * 100)}%`,
              borderRadius: `${theme.border.radius.xs} ${theme.border.radius.xs} 0 0`,
              background: dia.faturamento > 0 ? theme.color.green : theme.background.tertiary,
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text size="xs" color="tertiary">
          {dias[0]?.dia.split('-').reverse().slice(0, 2).join('/')}
        </Text>
        <Text size="xs" color="tertiary">
          {dias[dias.length - 1]?.dia.split('-').reverse().slice(0, 2).join('/')}
        </Text>
      </div>
    </div>
  );
};

const PainelVendas = () => {
  const theme = useTheme();
  const [periodo, setPeriodo] = useState<PeriodoPainel>('30D');
  const [estado, setEstado] = useState<Estado>({ tipo: 'CARREGANDO' });

  const carregar = useCallback(async () => {
    setEstado({ tipo: 'CARREGANDO' });

    try {
      const desde = new Date(Date.now() - DIAS_CARREGADOS * 24 * 60 * 60 * 1000);
      const registros = await carregarVendasPainel(desde);

      setEstado({ tipo: 'PRONTO', registros, carregadoEm: new Date() });
    } catch (erro) {
      setEstado({ tipo: 'ERRO', mensagem: mensagemDeErro(erro) });
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const dados = useMemo(() => {
    if (estado.tipo !== 'PRONTO') {
      return null;
    }

    const todas = estado.registros.map(mapearRegistroVenda);
    const intervalo = obterIntervaloPeriodo(periodo, estado.carregadoEm);
    const vendas = filtrarVendasPorIntervalo(todas, {
      inicio: intervalo.inicio,
      fim: new Date(intervalo.fim.getTime() + 1),
    });
    const anteriores = filtrarVendasPorIntervalo(todas, obterIntervaloAnterior(intervalo));
    const recentesComProblema = estado.registros
      .filter((registro) => {
        const data = registro.dataEvento ? new Date(registro.dataEvento) : null;

        return (
          data !== null &&
          data >= intervalo.inicio &&
          ['RECUSADA', 'FALHA', 'CHARGEBACK', 'REEMBOLSADA'].includes(registro.status ?? '')
        );
      })
      .slice(0, 6);

    return {
      intervalo,
      metricas: calcularMetricasVendas(vendas),
      metricasAnteriores: calcularMetricasVendas(anteriores),
      porStatus: agruparVendas(vendas, 'status'),
      porMetodo: agruparVendas(vendas, 'metodoPagamento'),
      porGateway: agruparVendas(vendas, 'gateway'),
      porDia: agruparVendasPorDia(vendas, intervalo),
      recentesComProblema,
    };
  }, [estado, periodo]);

  const variacao = (atual: number, anterior: number, inverter = false) => {
    const valor = calcularVariacao(atual, anterior);

    if (valor === null) {
      return { detalhe: 'sem dados do período anterior', tom: 'neutro' as const };
    }

    const melhorou = inverter ? valor < 0 : valor > 0;

    return {
      detalhe: `${valor >= 0 ? '▲' : '▼'} ${formatarPercentual(Math.abs(valor))} vs. período anterior`,
      tom: valor === 0 ? ('neutro' as const) : melhorou ? ('positivo' as const) : ('negativo' as const),
    };
  };

  const abrirVenda = (id: string) =>
    navigate(AppPath.RecordShowPage, {
      objectNameSingular: OBJECTS.venda.nameSingular,
      objectRecordId: id,
    });

  return (
    <main
      style={{
        boxSizing: 'border-box',
        height: '100%',
        minHeight: '100%',
        width: '100%',
        overflow: 'auto',
        padding: theme.spacing[4],
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[4],
        background: theme.background.secondary,
        color: theme.font.color.primary,
      }}
    >
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing[3],
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1] }}>
          <Heading level={1} size="lg">
            Painel de Vendas
          </Heading>
          <Text size="sm" color="tertiary">
            {dados
              ? `${formatarData(dados.intervalo.inicio)} a ${formatarData(dados.intervalo.fim)} · ${dados.metricas.totalRegistros} registro(s)`
              : 'Faturamento, aprovações, recusas, reembolsos e chargebacks'}
          </Text>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing[2] }}>
          <ButtonGroup attached size="sm" variant="outline" aria-label="Período">
            {PERIODOS.map((opcao) => (
              <Button
                key={opcao.valor}
                variant={periodo === opcao.valor ? 'solid' : 'outline'}
                color={periodo === opcao.valor ? 'accent' : 'neutral'}
                aria-pressed={periodo === opcao.valor}
                onClick={() => setPeriodo(opcao.valor)}
              >
                {opcao.rotulo}
              </Button>
            ))}
          </ButtonGroup>
          <Button
            size="sm"
            variant="ghost"
            startIcon={<IconRefresh size={16} aria-hidden />}
            loading={estado.tipo === 'CARREGANDO'}
            onClick={() => void carregar()}
          >
            Atualizar
          </Button>
        </div>
      </header>

      {estado.tipo === 'CARREGANDO' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing[8] }}>
          <Loader />
        </div>
      )}

      {estado.tipo === 'ERRO' && (
        <Callout
          status="error"
          title="Não foi possível carregar as vendas"
          description={estado.mensagem}
          action={
            <Button size="sm" onClick={() => void carregar()}>
              Tentar novamente
            </Button>
          }
        />
      )}

      {dados !== null && dados.metricas.totalRegistros === 0 && (
        <Callout
          status="info"
          title="Nenhuma venda neste período"
          description="As vendas aparecem aqui assim que os gateways enviarem webhooks (veja o README do módulo Vendas) ou quando forem cadastradas manualmente."
        />
      )}

      {dados !== null && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: theme.spacing[3],
            }}
          >
            <CartaoKpi
              titulo="Faturamento bruto"
              valor={formatarMoedaBrl(dados.metricas.faturamentoBruto)}
              {...variacao(dados.metricas.faturamentoBruto, dados.metricasAnteriores.faturamentoBruto)}
            />
            <CartaoKpi
              titulo="Faturamento líquido"
              valor={formatarMoedaBrl(dados.metricas.faturamentoLiquido)}
              {...variacao(dados.metricas.faturamentoLiquido, dados.metricasAnteriores.faturamentoLiquido)}
            />
            <CartaoKpi
              titulo="Taxas dos gateways"
              valor={formatarMoedaBrl(dados.metricas.totalTaxas)}
              detalhe={`${formatarPercentual(dados.metricas.faturamentoBruto > 0 ? dados.metricas.totalTaxas / dados.metricas.faturamentoBruto : 0)} do bruto`}
            />
            <CartaoKpi
              titulo="Vendas pagas"
              valor={String(dados.metricas.quantidadePagas)}
              {...variacao(dados.metricas.quantidadePagas, dados.metricasAnteriores.quantidadePagas)}
            />
            <CartaoKpi
              titulo="Ticket médio"
              valor={formatarMoedaBrl(dados.metricas.ticketMedio)}
              {...variacao(dados.metricas.ticketMedio, dados.metricasAnteriores.ticketMedio)}
            />
            <CartaoKpi
              titulo="Taxa de aprovação"
              valor={formatarPercentual(dados.metricas.taxaAprovacao)}
              detalhe={`${dados.metricas.quantidadePagas} de ${dados.metricas.quantidadePagas + dados.metricas.quantidadeRecusadas} tentativas`}
            />
            <CartaoKpi
              titulo="Taxa de recusa"
              valor={formatarPercentual(dados.metricas.taxaRecusa)}
              detalhe={`${dados.metricas.quantidadeRecusadas} recusa(s) · ${formatarMoedaBrl(dados.metricas.valorRecusado)}`}
              tom={dados.metricas.taxaRecusa > 0.3 ? 'negativo' : 'neutro'}
            />
            <CartaoKpi
              titulo="Chargebacks"
              valor={formatarPercentual(dados.metricas.percentualChargeback)}
              detalhe={`${dados.metricas.quantidadeChargebacks} · ${formatarMoedaBrl(dados.metricas.valorChargeback)}`}
              tom={dados.metricas.percentualChargeback > 0.01 ? 'negativo' : 'neutro'}
            />
            <CartaoKpi
              titulo="Reembolsos"
              valor={formatarPercentual(dados.metricas.percentualReembolso)}
              detalhe={`${dados.metricas.quantidadeReembolsadas} · ${formatarMoedaBrl(dados.metricas.valorReembolsado)}`}
            />
            <CartaoKpi
              titulo="Pendentes"
              valor={formatarMoedaBrl(dados.metricas.valorPendente)}
              detalhe={`${dados.metricas.quantidadePendentes} aguardando pagamento`}
            />
          </div>

          <Painel titulo="Faturamento pago por dia">
            <GraficoDiario dias={dados.porDia} />
          </Painel>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: theme.spacing[3],
            }}
          >
            <Painel titulo="Por status">
              <ListaAgrupada grupos={dados.porStatus} opcoes={VENDA_STATUS_OPCOES} />
            </Painel>
            <Painel titulo="Por método de pagamento">
              <ListaAgrupada grupos={dados.porMetodo} opcoes={METODO_PAGAMENTO_OPCOES} />
            </Painel>
            <Painel titulo="Por gateway">
              <ListaAgrupada grupos={dados.porGateway} opcoes={GATEWAY_OPCOES} />
            </Painel>
          </div>

          <Painel titulo="Problemas recentes">
            {dados.recentesComProblema.length === 0 ? (
              <Text size="sm" color="tertiary">
                Nenhuma recusa, falha, reembolso ou chargeback no período.
              </Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {dados.recentesComProblema.map((registro) => {
                  const opcao = VENDA_STATUS_OPCOES.find((item) => item.value === registro.status);

                  return (
                    <button
                      key={registro.id}
                      type="button"
                      onClick={() => abrirVenda(registro.id)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                        alignItems: 'center',
                        gap: theme.spacing[3],
                        padding: `${theme.spacing[2]} 0`,
                        border: 'none',
                        borderBottom: `1px solid ${theme.border.color.light}`,
                        background: 'transparent',
                        color: 'inherit',
                        cursor: 'pointer',
                        textAlign: 'left',
                        font: 'inherit',
                      }}
                    >
                      <Tag color={opcao?.color ?? 'gray'} startIcon={<IconAlertTriangle size={12} aria-hidden />}>
                        {opcao?.label ?? registro.status}
                      </Tag>
                      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {registro.descricao ?? 'Venda'}
                        {registro.clienteNome ? ` · ${registro.clienteNome}` : ''}
                        {registro.motivoRecusa ? (
                          <span style={{ color: theme.font.color.tertiary }}> — {registro.motivoRecusa}</span>
                        ) : null}
                      </span>
                      <span style={{ fontSize: theme.font.size.sm, color: theme.font.color.secondary, whiteSpace: 'nowrap' }}>
                        {formatarMoedaBrl(mapearRegistroVenda(registro).valor)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </Painel>
        </>
      )}
    </main>
  );
};

export default defineFrontComponent({
  universalIdentifier: VENDAS_IDS.painelFrontComponent,
  name: 'painel-vendas',
  description: 'Painel de Vendas: faturamento, aprovações, recusas, reembolsos e chargebacks por período.',
  component: PainelVendas,
});
