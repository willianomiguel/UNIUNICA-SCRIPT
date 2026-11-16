import { useCallback, useEffect, useMemo, useState } from 'react';
import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineFrontComponent, PageLayoutType } from 'twenty-sdk/define';
import { Callout } from 'twenty-ui/components/feedback';
import { LightButton, LightIconButton } from 'twenty-ui/components/input';
import { IconChevronLeft, IconChevronRight, IconRefresh } from 'twenty-ui/icon';
import { Loader } from 'twenty-ui/primitives/feedback';
import { Text } from 'twenty-ui/primitives/typography';
import { useTheme } from 'twenty-ui/theme';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { type DadosFinanceiros } from 'src/modules/financeiro/types/dados-financeiros';
import { type LinhaValor } from 'src/modules/financeiro/types/linha-valor';
import { calcularEmAberto } from 'src/modules/financeiro/utils/calcular-em-aberto.util';
import { calcularDreSimplificada } from 'src/modules/financeiro/utils/calcular-dre-simplificada.util';
import { calcularFluxoCaixaMensal } from 'src/modules/financeiro/utils/calcular-fluxo-caixa-mensal.util';
import { calcularOrcadoRealizado } from 'src/modules/financeiro/utils/calcular-orcado-realizado.util';
import { calcularSaldoAnterior } from 'src/modules/financeiro/utils/calcular-saldo-anterior.util';
import { carregarDadosFinanceiros } from 'src/modules/financeiro/utils/carregar-dados-financeiros.util';
import { deslocarMes } from 'src/modules/financeiro/utils/deslocar-mes.util';
import { formatarBrl } from 'src/modules/financeiro/utils/formatar-brl.util';
import { formatarMes } from 'src/modules/financeiro/utils/formatar-mes.util';
import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';
import { IndicadoresPrincipais } from 'src/modules/shared/components/indicadores-principais';
import { IndicadoresSecundarios } from 'src/modules/shared/components/indicadores-secundarios';
import { Titulo } from 'src/modules/shared/components/titulo';

const MESES_NO_FLUXO = 6;

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'pronto'; dados: DadosFinanceiros };

const PainelFinanceiro = () => {
  const theme = useTheme();
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });
  const [mes, setMes] = useState(() => hojeIso().slice(0, 7));

  const carregar = useCallback(() => {
    setEstado({ tipo: 'carregando' });
    carregarDadosFinanceiros(new RestApiClient())
      .then((dados) => setEstado({ tipo: 'pronto', dados }))
      .catch((erro: unknown) =>
        setEstado({
          tipo: 'erro',
          mensagem: erro instanceof Error ? erro.message : String(erro),
        }),
      );
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const resumo = useMemo(() => {
    if (estado.tipo !== 'pronto') {
      return null;
    }

    const { lancamentos, categorias } = estado.dados;
    const inicio = deslocarMes(mes, -(MESES_NO_FLUXO - 1));

    return {
      fluxo: calcularFluxoCaixaMensal(
        lancamentos,
        inicio,
        mes,
        calcularSaldoAnterior(lancamentos, inicio),
      ),
      dre: calcularDreSimplificada(lancamentos, categorias, mes),
      orcado: calcularOrcadoRealizado(categorias, lancamentos, mes),
      emAberto: calcularEmAberto(lancamentos),
      vazio: lancamentos.length === 0,
    };
  }, [estado, mes]);

  const cartao = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing[1],
    padding: theme.spacing[3],
    border: `1px solid ${theme.border.color.light}`,
    borderRadius: theme.border.radius.md,
    background: theme.background.primary,
    minWidth: 0,
  };
  const celula = {
    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
    borderBottom: `1px solid ${theme.border.color.light}`,
    textAlign: 'right' as const,
    whiteSpace: 'nowrap' as const,
    fontSize: theme.font.size.sm,
    color: theme.font.color.primary,
  };
  const corValor = (valor: number) =>
    valor < 0 ? theme.color.red : theme.font.color.primary;

  const cabecalho = (
    <Titulo
      nivel="pagina"
      titulo="Financeiro"
      descricao="Resumo do mês: entradas, saídas, contas em aberto e orçamento"
      acoes={
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1] }}>
            <LightIconButton
              aria-label="Mês anterior"
              onClick={() => setMes((atual) => deslocarMes(atual, -1))}
            >
              <IconChevronLeft size={16} />
            </LightIconButton>
            <Text size="md" weight="semibold">
              {formatarMes(mes)}
            </Text>
            <LightIconButton
              aria-label="Próximo mês"
              onClick={() => setMes((atual) => deslocarMes(atual, 1))}
            >
              <IconChevronRight size={16} />
            </LightIconButton>
          </div>
          <LightButton
            size="sm"
            startIcon={<IconRefresh size={14} />}
            onClick={carregar}
            disabled={estado.tipo === 'carregando'}
          >
            Atualizar
          </LightButton>
        </>
      }
    />
  );

  if (estado.tipo === 'carregando') {
    return (
      <div style={{ padding: theme.spacing[4], display: 'flex', justifyContent: 'center' }}>
        <Loader />
      </div>
    );
  }

  if (estado.tipo === 'erro' || resumo === null) {
    return (
      <div style={{ padding: theme.spacing[3] }}>
        <Callout
          status="error"
          title="Não foi possível carregar o financeiro"
          description={estado.tipo === 'erro' ? estado.mensagem : undefined}
          action={
            <LightButton size="sm" onClick={carregar}>
              Tentar de novo
            </LightButton>
          }
        />
      </div>
    );
  }

  const { fluxo, dre, orcado } = resumo;
  const saldoAcumulado = fluxo[fluxo.length - 1]?.saldoAcumulado ?? 0;
  const maiorValorFluxo = Math.max(
    1,
    ...fluxo.flatMap((linha) => [linha.entradas, linha.saidas]),
  );

  const listaValores = (titulo: string, linhas: LinhaValor[]) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1] }}>
      <Text size="xs" color="tertiary" weight="medium">
        {titulo}
      </Text>
      {linhas.length === 0 ? (
        <Text size="sm" color="light">
          Nada no mês
        </Text>
      ) : (
        linhas.map((linha) => (
          <div
            key={linha.chave}
            style={{ display: 'flex', justifyContent: 'space-between', gap: theme.spacing[2] }}
          >
            <Text size="sm" truncate>
              {linha.nome}
            </Text>
            <Text size="sm">{formatarBrl(linha.valor)}</Text>
          </div>
        ))
      )}
    </div>
  );

  return (
    <main
      style={{
        boxSizing: 'border-box',
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[4],
        padding: theme.spacing[4],
        background: theme.background.secondary,
        color: theme.font.color.primary,
        fontFamily: theme.font.family,
      }}
    >
      {cabecalho}

      {resumo.vazio && (
        <Callout
          status="info"
          title="Nenhum lançamento ainda"
          description="Cadastre lançamentos em Financeiro › Lançamentos ou aprove uma venda para ver os números aqui."
        />
      )}

      <IndicadoresPrincipais
        rotulo="Indicadores principais do financeiro"
        itens={[
          { titulo: 'Receita do mês', valor: formatarBrl(dre.receita) },
          { titulo: 'Custos do mês', valor: formatarBrl(dre.custos) },
          {
            titulo: 'Resultado',
            valor: formatarBrl(dre.resultado),
            detalhe: dre.margem === null ? 'sem receita no mês' : `margem ${dre.margem.toFixed(1).replace('.', ',')}%`,
            tom: dre.resultado < 0 ? 'negativo' : dre.resultado > 0 ? 'positivo' : 'neutro',
          },
          {
            titulo: 'Saldo acumulado',
            valor: formatarBrl(saldoAcumulado),
            detalhe: 'até o fim do mês',
            tom: saldoAcumulado < 0 ? 'negativo' : 'neutro',
          },
        ]}
      />

      <IndicadoresSecundarios
        rotulo="Contas em aberto hoje"
        itens={[
          {
            titulo: 'A receber (em aberto hoje)',
            valor: formatarBrl(resumo.emAberto.aReceber),
            detalhe: 'todos os meses · pendentes e atrasadas',
          },
          {
            titulo: 'A pagar (em aberto hoje)',
            valor: formatarBrl(resumo.emAberto.aPagar),
            detalhe: 'todos os meses · pendentes e atrasadas',
          },
        ]}
      />

      <section style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
        <Titulo titulo="Fluxo de caixa" descricao={`Últimos ${MESES_NO_FLUXO} meses (lançamentos não cancelados, pela data)`} />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Mês', 'Entradas', 'Saídas', '', 'Saldo', 'Saldo acumulado'].map(
                  (titulo, indice) => (
                    <th
                      key={`${titulo}-${indice}`}
                      style={{
                        ...celula,
                        color: theme.font.color.tertiary,
                        fontWeight: theme.font.weight.medium,
                        textAlign: indice === 0 ? 'left' : 'right',
                      }}
                    >
                      {titulo}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {fluxo.map((linha) => (
                <tr key={linha.mes}>
                  <td style={{ ...celula, textAlign: 'left' }}>{formatarMes(linha.mes)}</td>
                  <td style={{ ...celula, color: theme.color.green }}>
                    {formatarBrl(linha.entradas)}
                  </td>
                  <td style={{ ...celula, color: theme.color.red }}>
                    {formatarBrl(linha.saidas)}
                  </td>
                  <td style={{ ...celula, width: '30%', minWidth: '120px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div
                        aria-hidden
                        style={{
                          height: '6px',
                          borderRadius: '3px',
                          background: theme.color.green,
                          width: `${(linha.entradas / maiorValorFluxo) * 100}%`,
                        }}
                      />
                      <div
                        aria-hidden
                        style={{
                          height: '6px',
                          borderRadius: '3px',
                          background: theme.color.red,
                          width: `${(linha.saidas / maiorValorFluxo) * 100}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ ...celula, color: corValor(linha.saldo) }}>
                    {formatarBrl(linha.saldo)}
                  </td>
                  <td
                    style={{
                      ...celula,
                      color: corValor(linha.saldoAcumulado),
                      fontWeight: theme.font.weight.medium,
                    }}
                  >
                    {formatarBrl(linha.saldoAcumulado)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: theme.spacing[4],
        }}
      >
        <section style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
          <Titulo titulo="DRE do mês" descricao={`Demonstrativo simplificado de ${formatarMes(mes)}`} />
          <div style={{ ...cartao, gap: theme.spacing[3] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text weight="semibold">(+) Receita</Text>
              <Text weight="semibold">{formatarBrl(dre.receita)}</Text>
            </div>
            {listaValores('Receitas por categoria', dre.receitasPorCategoria)}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text weight="semibold">(−) Custos e despesas</Text>
              <Text weight="semibold">{formatarBrl(dre.custos)}</Text>
            </div>
            {listaValores('Por categoria', dre.custosPorCategoria)}
            {listaValores('Por centro de custo', dre.custosPorCentroCusto)}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: `1px solid ${theme.border.color.medium}`,
                paddingTop: theme.spacing[2],
              }}
            >
              <Text weight="semibold">(=) Resultado</Text>
              <span
                style={{
                  fontWeight: theme.font.weight.semiBold,
                  color: corValor(dre.resultado),
                }}
              >
                {formatarBrl(dre.resultado)}
              </span>
            </div>
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
          <Titulo titulo="Orçado x realizado" descricao="Orçamento mensal de cada categoria" />
          <div style={{ ...cartao, gap: theme.spacing[3] }}>
            {orcado.length === 0 ? (
              <Text size="sm" color="light">
                Cadastre categorias com orçamento mensal para acompanhar aqui.
              </Text>
            ) : (
              orcado.map((linha) => {
                const percentual = linha.percentual ?? 0;
                const estourou = linha.tipo === 'SAIDA' && percentual > 100;
                const corBarra =
                  linha.tipo === 'ENTRADA'
                    ? theme.color.green
                    : estourou
                      ? theme.color.red
                      : percentual > 85
                        ? theme.color.orange
                        : theme.color.blue;

                return (
                  <div
                    key={linha.categoriaId}
                    style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1] }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: theme.spacing[2],
                      }}
                    >
                      <Text size="sm" weight="medium" truncate>
                        {linha.nome}
                      </Text>
                      <Text size="sm" color={estourou ? 'primary' : 'secondary'}>
                        {formatarBrl(linha.realizado)} / {formatarBrl(linha.orcado)}
                        {linha.percentual === null
                          ? ''
                          : ` (${Math.round(linha.percentual)}%)`}
                      </Text>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={`${linha.nome}: ${Math.round(percentual)}% do orçamento`}
                      aria-valuenow={Math.round(percentual)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      style={{
                        height: '6px',
                        borderRadius: '3px',
                        background: theme.background.tertiary,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(percentual, 100)}%`,
                          background: corBarra,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default defineFrontComponent({
  universalIdentifier: FINANCEIRO_IDS.FRONT_PAINEL,
  name: 'painel-financeiro',
  description:
    'Painel financeiro: fluxo de caixa mensal, DRE simplificada do mês e orçado x realizado por categoria.',
  component: PainelFinanceiro,
  widgetAvailability: { pageLayoutType: PageLayoutType.DASHBOARD },
});
