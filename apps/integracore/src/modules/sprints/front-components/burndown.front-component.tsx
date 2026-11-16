import { useCallback, useEffect, useState } from 'react';
import { RestApiClient } from 'integra-client-sdk/rest';
import { defineFrontComponent, PageLayoutType } from 'integra-sdk/define';
import { useSelectedRecordIds } from 'integra-sdk/front-component';
import { Callout } from 'integra-ui/components/feedback';
import { LightButton } from 'integra-ui/components/input';
import { IconRefresh } from 'integra-ui/icon';
import { Tag } from 'integra-ui/primitives/data-display';
import { Loader } from 'integra-ui/primitives/feedback';
import { Text } from 'integra-ui/primitives/typography';
import { useTheme } from 'integra-ui/theme';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { type PontoGraficoBurndown } from 'src/modules/sprints/types/ponto-grafico-burndown';
import { type SprintResumo } from 'src/modules/sprints/types/sprint-resumo';
import { calcularEscalaLinear } from 'src/modules/sprints/utils/calcular-escala-linear.util';
import { dataHojeIso } from 'src/modules/sprints/utils/data-hoje-iso.util';
import { gerarCaminhoSvg } from 'src/modules/sprints/utils/gerar-caminho-svg.util';
import { listarDiasEntreDatas } from 'src/modules/sprints/utils/listar-dias-entre-datas.util';
import { montarSerieBurndown } from 'src/modules/sprints/utils/montar-serie-burndown.util';

const LARGURA = 640;
const ALTURA = 240;
const MARGEM = { topo: 16, direita: 16, base: 32, esquerda: 40 };

const formatarDiaMes = (data: string) => `${data.slice(8, 10)}/${data.slice(5, 7)}`;

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'pronto'; sprint: SprintResumo };

const Grafico = ({ serie }: { serie: PontoGraficoBurndown[] }) => {
  const theme = useTheme();
  const maximo = Math.max(1, ...serie.map((p) => Math.max(p.ideal, p.real ?? 0)));
  const x = calcularEscalaLinear(
    [0, Math.max(serie.length - 1, 1)],
    [MARGEM.esquerda, LARGURA - MARGEM.direita],
  );
  const y = calcularEscalaLinear([0, maximo], [ALTURA - MARGEM.base, MARGEM.topo]);
  const caminhoIdeal = gerarCaminhoSvg(serie.map((p, i) => ({ x: x(i), y: y(p.ideal) })));
  const caminhoReal = gerarCaminhoSvg(
    serie.map((p, i) => ({ x: x(i), y: p.real === null ? null : y(p.real) })),
  );
  const marcasY = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maximo * f));
  const passoX = Math.max(1, Math.ceil(serie.length / 7));

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      width="100%"
      role="img"
      aria-label="Gráfico de burndown: linha ideal e pontos restantes reais"
      style={{ display: 'block', maxWidth: '100%' }}
    >
      {[...new Set(marcasY)].map((valor) => (
        <g key={`y-${valor}`}>
          <line
            x1={MARGEM.esquerda}
            x2={LARGURA - MARGEM.direita}
            y1={y(valor)}
            y2={y(valor)}
            stroke={theme.border.color.light}
            strokeWidth={1}
          />
          <text
            x={MARGEM.esquerda - 8}
            y={y(valor) + 4}
            textAnchor="end"
            fontSize={11}
            fill={theme.font.color.tertiary}
          >
            {valor}
          </text>
        </g>
      ))}
      {serie.map((p, i) =>
        i % passoX === 0 || i === serie.length - 1 ? (
          <text
            key={`x-${p.data}`}
            x={x(i)}
            y={ALTURA - 10}
            textAnchor="middle"
            fontSize={11}
            fill={theme.font.color.tertiary}
          >
            {formatarDiaMes(p.data)}
          </text>
        ) : null,
      )}
      <path
        d={caminhoIdeal}
        fill="none"
        stroke={theme.font.color.light}
        strokeWidth={2}
        strokeDasharray="6 4"
      />
      <path d={caminhoReal} fill="none" stroke={theme.color.blue} strokeWidth={2.5} />
      {serie.map((p, i) =>
        p.real === null ? null : (
          <circle key={`p-${p.data}`} cx={x(i)} cy={y(p.real)} r={3} fill={theme.color.blue} />
        ),
      )}
    </svg>
  );
};

const Indicador = ({ rotulo, valor }: { rotulo: string; valor: string }) => {
  const theme = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1], minWidth: 0 }}>
      <Text size="xs" color="tertiary">
        {rotulo}
      </Text>
      <Text size="lg" weight="semibold">
        {valor}
      </Text>
    </div>
  );
};

const Burndown = () => {
  const theme = useTheme();
  const selecionados = useSelectedRecordIds();
  const sprintId = selecionados.length === 1 ? selecionados[0] : null;
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });

  const carregar = useCallback(async () => {
    if (!sprintId) {
      return;
    }

    setEstado({ tipo: 'carregando' });

    try {
      const resposta = await new RestApiClient().get<{ data?: { sprint?: SprintResumo } }>(
        `/rest/sprints/${sprintId}`,
        { query: { depth: 0 } },
      );
      const sprint = resposta.data?.sprint;

      setEstado(
        sprint
          ? { tipo: 'pronto', sprint }
          : { tipo: 'erro', mensagem: 'Sprint não encontrada.' },
      );
    } catch (erro) {
      setEstado({
        tipo: 'erro',
        mensagem: erro instanceof Error ? erro.message : 'Erro ao carregar a sprint.',
      });
    }
  }, [sprintId]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const raiz = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing[3],
    padding: theme.spacing[3],
    width: '100%',
    boxSizing: 'border-box' as const,
    minWidth: 0,
  };

  if (!sprintId) {
    return (
      <div style={raiz}>
        <Callout status="info" title="Abra uma sprint para ver o burndown." />
      </div>
    );
  }

  if (estado.tipo === 'carregando') {
    return (
      <div style={{ ...raiz, alignItems: 'center', minHeight: 120, justifyContent: 'center' }}>
        <Loader />
      </div>
    );
  }

  if (estado.tipo === 'erro') {
    return (
      <div style={raiz}>
        <Callout
          status="error"
          title="Não foi possível carregar o burndown"
          description={estado.mensagem}
          action={
            <LightButton size="sm" onClick={() => void carregar()}>
              Tentar de novo
            </LightButton>
          }
        />
      </div>
    );
  }

  const { sprint } = estado;
  const hoje = dataHojeIso();
  const totais = sprint.pontosTotais ?? 0;
  const concluidos = sprint.pontosConcluidos ?? 0;
  const restantes = Math.max(totais - concluidos, 0);
  const serie = montarSerieBurndown({
    dataInicio: sprint.dataInicio,
    dataFim: sprint.dataFim,
    pontosTotais: totais,
    historico: sprint.historicoBurndown,
    hoje,
  });
  const diasRestantes = listarDiasEntreDatas(hoje, sprint.dataFim).length;
  const percentual = totais > 0 ? Math.round((concluidos / totais) * 100) : 0;
  const acimaDaCapacidade =
    typeof sprint.capacidadePontos === 'number' &&
    sprint.capacidadePontos > 0 &&
    totais > sprint.capacidadePontos;

  return (
    <div style={raiz}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing[2],
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: theme.spacing[2], flexWrap: 'wrap', alignItems: 'center' }}>
          <Tag color="blue">Real</Tag>
          <Tag color="gray" borderStyle="dashed">
            Ideal
          </Tag>
          {sprint.precisaEncerrar ? <Tag color="orange">Precisa encerrar</Tag> : null}
          {acimaDaCapacidade ? <Tag color="red">Acima da capacidade</Tag> : null}
        </div>
        <LightButton
          size="sm"
          startIcon={<IconRefresh size={14} />}
          onClick={() => void carregar()}
        >
          Atualizar
        </LightButton>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: theme.spacing[3],
        }}
      >
        <Indicador rotulo="Pontos totais" valor={String(totais)} />
        <Indicador rotulo="Concluídos" valor={`${concluidos} (${percentual}%)`} />
        <Indicador rotulo="Restantes" valor={String(restantes)} />
        <Indicador
          rotulo="Capacidade"
          valor={sprint.capacidadePontos != null ? String(sprint.capacidadePontos) : '—'}
        />
        <Indicador
          rotulo="Dias restantes"
          valor={sprint.status === 'ATIVA' ? String(diasRestantes) : '—'}
        />
      </div>

      {serie.length === 0 ? (
        <Callout
          status="neutral"
          title="Defina as datas de início e fim"
          description="O gráfico aparece quando a sprint tem data de início e de fim."
        />
      ) : (
        <Grafico serie={serie} />
      )}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: SPRINTS_IDS.frontComponents.burndown,
  name: 'sprints-burndown',
  description: 'Gráfico de burndown da sprint: linha ideal x pontos restantes reais',
  component: Burndown,
  widgetAvailability: {
    pageLayoutType: PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifiers: [SPRINTS_IDS.objects.sprint],
  },
});
