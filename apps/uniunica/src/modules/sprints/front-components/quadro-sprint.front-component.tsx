import { useCallback, useEffect, useState } from 'react';
import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineFrontComponent } from 'twenty-sdk/define';
import { AppPath, enqueueSnackbar, navigate } from 'twenty-sdk/front-component';
import { Callout } from 'twenty-ui/components/feedback';
import { LightButton } from 'twenty-ui/components/input';
import { IconArrowLeft, IconArrowRight, IconRefresh } from 'twenty-ui/icon';
import { Tag } from 'twenty-ui/primitives/data-display';
import { Loader } from 'twenty-ui/primitives/feedback';
import { Text } from 'twenty-ui/primitives/typography';
import { useTheme } from 'twenty-ui/theme';

import { Titulo } from 'src/modules/shared/components/titulo';
import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { TAREFA_PRIORIDADE_OPTIONS } from 'src/modules/sprints/constants/tarefa-prioridade-options';
import { TAREFA_TIPO_OPTIONS } from 'src/modules/sprints/constants/tarefa-tipo-options';
import { type SprintResumo } from 'src/modules/sprints/types/sprint-resumo';
import { type TarefaSprint } from 'src/modules/sprints/types/tarefa-sprint';
import { agruparTarefasPorStatus } from 'src/modules/sprints/utils/agrupar-tarefas-por-status.util';
import { calcularPontosSprint } from 'src/modules/sprints/utils/calcular-pontos-sprint.util';

type Coluna = 'TODO' | 'IN_PROGRESS' | 'DONE';

const COLUNAS: Array<{ status: Coluna; titulo: string }> = [
  { status: 'TODO', titulo: 'A fazer' },
  { status: 'IN_PROGRESS', titulo: 'Em andamento' },
  { status: 'DONE', titulo: 'Concluído' },
];

const ANTERIOR: Record<Coluna, Coluna | null> = {
  TODO: null,
  IN_PROGRESS: 'TODO',
  DONE: 'IN_PROGRESS',
};

const PROXIMO: Record<Coluna, Coluna | null> = {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: null,
};

const opcao = (
  opcoes: Array<{ value: string; label: string; color: string }>,
  valor: string | null | undefined,
) => opcoes.find((o) => o.value === valor);

const formatarData = (data: string | null | undefined) =>
  data ? `${data.slice(8, 10)}/${data.slice(5, 7)}` : '—';

type Dados =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'pronto'; sprints: SprintResumo[]; tarefas: TarefaSprint[] };

const CartaoTarefa = ({
  tarefa,
  coluna,
  ocupado,
  onMover,
}: {
  tarefa: TarefaSprint;
  coluna: Coluna;
  ocupado: boolean;
  onMover: (tarefa: TarefaSprint, destino: Coluna) => void;
}) => {
  const theme = useTheme();
  const tipo = opcao(TAREFA_TIPO_OPTIONS, tarefa.tipo);
  const prioridade = opcao(TAREFA_PRIORIDADE_OPTIONS, tarefa.prioridade);
  const anterior = ANTERIOR[coluna];
  const proximo = PROXIMO[coluna];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[2],
        padding: theme.spacing[2],
        background: theme.background.primary,
        border: `1px solid ${theme.border.color.medium}`,
        borderRadius: theme.border.radius.md,
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: theme.spacing[2] }}>
        <Text size="xs" color="tertiary">
          {tarefa.codigo ?? 'sem código'}
        </Text>
        <Tag color="gray" weight="medium">
          {tarefa.pontos ?? 0} pt
        </Tag>
      </div>
      <a
        href="#"
        onClick={(evento) => {
          evento.preventDefault();
          void navigate(AppPath.RecordShowPage, {
            objectNameSingular: 'task',
            objectRecordId: tarefa.id,
          });
        }}
        style={{ color: theme.font.color.primary, textDecoration: 'none', minWidth: 0 }}
      >
        <Text weight="medium" lineClamp={2}>
          {tarefa.title || 'Sem título'}
        </Text>
      </a>
      <div style={{ display: 'flex', gap: theme.spacing[1], flexWrap: 'wrap' }}>
        {tipo ? <Tag color={tipo.color as 'blue'}>{tipo.label}</Tag> : null}
        {prioridade ? (
          <Tag color={prioridade.color as 'blue'} variant="outline">
            {prioridade.label}
          </Tag>
        ) : null}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: theme.spacing[1] }}>
        {anterior ? (
          <LightButton
            size="sm"
            disabled={ocupado}
            aria-label={`Voltar ${tarefa.codigo ?? ''} para ${COLUNAS.find((c) => c.status === anterior)?.titulo}`}
            startIcon={<IconArrowLeft size={14} />}
            onClick={() => onMover(tarefa, anterior)}
          >
            Voltar
          </LightButton>
        ) : (
          <span />
        )}
        {proximo ? (
          <LightButton
            size="sm"
            disabled={ocupado}
            aria-label={`Avançar ${tarefa.codigo ?? ''} para ${COLUNAS.find((c) => c.status === proximo)?.titulo}`}
            endIcon={<IconArrowRight size={14} />}
            onClick={() => onMover(tarefa, proximo)}
          >
            Avançar
          </LightButton>
        ) : null}
      </div>
    </div>
  );
};

const QuadroSprint = () => {
  const theme = useTheme();
  const [dados, setDados] = useState<Dados>({ tipo: 'carregando' });
  const [sprintSelecionada, setSprintSelecionada] = useState<string | null>(null);
  const [movendo, setMovendo] = useState<string | null>(null);

  const carregar = useCallback(async (sprintIdPreferida?: string | null) => {
    try {
      const cliente = new RestApiClient();
      const respostaSprints = await cliente.get<{ data?: { sprints?: SprintResumo[] } }>(
        '/rest/sprints',
        { query: { filter: 'status[eq]:ATIVA', order_by: 'dataInicio[AscNullsLast]', limit: 50, depth: 0 } },
      );
      const sprints = respostaSprints.data?.sprints ?? [];
      const escolhida =
        sprints.find((s) => s.id === sprintIdPreferida)?.id ?? sprints[0]?.id ?? null;
      let tarefas: TarefaSprint[] = [];

      if (escolhida) {
        const respostaTarefas = await cliente.get<{ data?: { tasks?: TarefaSprint[] } }>(
          '/rest/tasks',
          { query: { filter: `sprintId[eq]:${escolhida}`, limit: 200, depth: 0 } },
        );

        tarefas = respostaTarefas.data?.tasks ?? [];
      }

      setSprintSelecionada(escolhida);
      setDados({ tipo: 'pronto', sprints, tarefas });
    } catch (erro) {
      setDados({
        tipo: 'erro',
        mensagem: erro instanceof Error ? erro.message : 'Erro ao carregar o quadro.',
      });
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const moverTarefa = async (tarefa: TarefaSprint, destino: Coluna) => {
    if (dados.tipo !== 'pronto') {
      return;
    }

    setMovendo(tarefa.id);

    try {
      await new RestApiClient().patch(`/rest/tasks/${tarefa.id}`, { status: destino });
      setDados({
        ...dados,
        tarefas: dados.tarefas.map((t) => (t.id === tarefa.id ? { ...t, status: destino } : t)),
      });
    } catch (erro) {
      await enqueueSnackbar({
        message: `Não foi possível mover ${tarefa.codigo ?? 'a tarefa'}`,
        detailedMessage: erro instanceof Error ? erro.message : undefined,
        variant: 'error',
      });
    } finally {
      setMovendo(null);
    }
  };

  const raiz = {
    boxSizing: 'border-box' as const,
    display: 'grid',
    gridTemplateRows: 'auto auto minmax(0, 1fr)',
    gap: theme.spacing[4],
    height: '100%',
    minHeight: '100%',
    width: '100%',
    padding: theme.spacing[4],
    overflow: 'hidden',
  };

  const atualizar = (
    <LightButton
      size="sm"
      startIcon={<IconRefresh size={14} />}
      onClick={() => {
        setDados({ tipo: 'carregando' });
        void carregar(sprintSelecionada);
      }}
    >
      Atualizar
    </LightButton>
  );

  if (dados.tipo === 'carregando') {
    return (
      <main style={{ ...raiz, placeItems: 'center' }}>
        <Loader />
      </main>
    );
  }

  if (dados.tipo === 'erro') {
    return (
      <main style={raiz}>
        <Titulo nivel="pagina" titulo="Quadro da sprint" acoes={atualizar} />
        <Callout status="error" title="Não foi possível carregar o quadro" description={dados.mensagem} />
      </main>
    );
  }

  const sprint = dados.sprints.find((s) => s.id === sprintSelecionada) ?? null;

  if (!sprint) {
    return (
      <main style={raiz}>
        <Titulo nivel="pagina" titulo="Quadro da sprint" acoes={atualizar} />
        <Callout
          status="info"
          title="Nenhuma sprint ativa"
          description="Abra uma sprint planejada e use a ação “Iniciar sprint” para começar."
          action={
            <LightButton
              size="sm"
              onClick={() => void navigate(AppPath.RecordIndexPage, { objectNamePlural: 'sprints' })}
            >
              Ver sprints
            </LightButton>
          }
        />
      </main>
    );
  }

  const colunas = agruparTarefasPorStatus(dados.tarefas);
  const pontos = calcularPontosSprint(dados.tarefas);

  return (
    <main style={raiz}>
      <Titulo
        nivel="pagina"
        titulo={sprint.nome ?? 'Sprint ativa'}
        descricao={`${formatarData(sprint.dataInicio)} → ${formatarData(sprint.dataFim)} · ${pontos.pontosConcluidos} de ${pontos.pontosTotais} pontos concluídos`}
        acoes={
          <div style={{ display: 'flex', gap: theme.spacing[2] }}>
            <LightButton
              size="sm"
              onClick={() =>
                void navigate(AppPath.RecordShowPage, {
                  objectNameSingular: 'sprint',
                  objectRecordId: sprint.id,
                })
              }
            >
              Abrir sprint
            </LightButton>
            {atualizar}
          </div>
        }
      />

      {dados.sprints.length > 1 ? (
        <div style={{ display: 'flex', gap: theme.spacing[2], flexWrap: 'wrap' }}>
          {dados.sprints.map((s) => (
            <LightButton
              key={s.id}
              size="sm"
              emphasis={s.id === sprint.id ? 'standard' : 'subtle'}
              aria-pressed={s.id === sprint.id}
              onClick={() => {
                setDados({ tipo: 'carregando' });
                void carregar(s.id);
              }}
            >
              {s.nome ?? 'Sprint'}
            </LightButton>
          ))}
        </div>
      ) : (
        <div />
      )}

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: theme.spacing[3],
          minHeight: 0,
          overflow: 'auto',
          alignItems: 'start',
        }}
      >
        {COLUNAS.map(({ status, titulo }) => {
          const tarefas = colunas[status];
          const soma = calcularPontosSprint(tarefas).pontosTotais;

          return (
            <div
              key={status}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing[2],
                padding: theme.spacing[2],
                background: theme.background.secondary,
                borderRadius: theme.border.radius.md,
                minWidth: 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text weight="semibold">{titulo}</Text>
                <Text size="xs" color="tertiary">
                  {tarefas.length} · {soma} pt
                </Text>
              </div>
              {tarefas.length === 0 ? (
                <Text size="sm" color="light">
                  Nenhuma tarefa
                </Text>
              ) : (
                tarefas.map((tarefa) => (
                  <CartaoTarefa
                    key={tarefa.id}
                    tarefa={tarefa}
                    coluna={status}
                    ocupado={movendo === tarefa.id}
                    onMover={(t, destino) => void moverTarefa(t, destino)}
                  />
                ))
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default defineFrontComponent({
  universalIdentifier: SPRINTS_IDS.frontComponents.quadro,
  name: 'sprints-quadro-sprint',
  description: 'Quadro da sprint ativa com as tarefas em colunas por status',
  component: QuadroSprint,
});
