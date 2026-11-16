import { useCallback, useEffect, useState } from 'react';
import { RestApiClient } from 'integra-client-sdk/rest';
import { defineFrontComponent, PageLayoutType } from 'integra-sdk/define';
import { AppPath, navigate } from 'integra-sdk/front-component';
import { Callout } from 'integra-ui/components/feedback';
import { LightButton } from 'integra-ui/components/input';
import { IconRefresh } from 'integra-ui/icon';
import { Loader } from 'integra-ui/primitives/feedback';
import { Text } from 'integra-ui/primitives/typography';
import { useTheme } from 'integra-ui/theme';

import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { CORES_STATUS_META } from 'src/modules/metas/constants/cores-status-meta';
import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { LinhaMeta } from 'src/modules/metas/front-components/components/linha-meta';
import { type MetaResumo } from 'src/modules/metas/types/meta-resumo';
import { type StatusMeta } from 'src/modules/metas/types/status-meta';
import { agruparMetasPorPeriodo } from 'src/modules/metas/utils/agrupar-metas-por-periodo.util';
import { normalizarMeta } from 'src/modules/metas/utils/normalizar-meta.util';
import { Titulo } from 'src/modules/shared/components/titulo';
import { OBJECTS } from 'src/modules/shared/constants/objects';

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'pronto'; metas: MetaResumo[] };

const abrirMeta = (id: string) =>
  navigate(AppPath.RecordShowPage, {
    objectNameSingular: OBJECTS.meta.nameSingular,
    objectRecordId: id,
  });

const PainelMetas = () => {
  const theme = useTheme();
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });
  const hoje = hojeIso();

  const carregar = useCallback(() => {
    setEstado({ tipo: 'carregando' });
    listarRegistros(new RestApiClient(), 'metas')
      .then((registros) => setEstado({ tipo: 'pronto', metas: registros.map(normalizarMeta) }))
      .catch((erro: unknown) =>
        setEstado({ tipo: 'erro', mensagem: erro instanceof Error ? erro.message : String(erro) }),
      );
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (estado.tipo === 'carregando') {
    return (
      <div style={{ padding: theme.spacing[4], display: 'flex', justifyContent: 'center' }}>
        <Loader />
      </div>
    );
  }

  if (estado.tipo === 'erro') {
    return (
      <div style={{ padding: theme.spacing[3] }}>
        <Callout
          status="error"
          title="Não foi possível carregar as metas"
          description={estado.mensagem}
          action={
            <LightButton size="sm" onClick={carregar}>
              Tentar de novo
            </LightButton>
          }
        />
      </div>
    );
  }

  const { metas } = estado;
  const grupos = agruparMetasPorPeriodo(metas);
  const submetasDe = (id: string) => metas.filter((meta) => meta.metaPaiId === id);
  const contagem = (status: StatusMeta) =>
    metas.filter((meta) => (meta.status ?? 'NO_PRAZO') === status).length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[4],
        padding: theme.spacing[3],
        color: theme.font.color.primary,
        fontFamily: theme.font.family,
      }}
    >
      <Titulo
        nivel="pagina"
        titulo="Metas"
        descricao="Metas principais de cada período e quanto falta para bater"
        acoes={
          <LightButton size="sm" startIcon={<IconRefresh size={14} />} onClick={carregar}>
            Atualizar
          </LightButton>
        }
      />
      <div style={{ display: 'flex', gap: theme.spacing[2], flexWrap: 'wrap' }}>
        {(Object.keys(CORES_STATUS_META) as StatusMeta[]).map((status) => (
          <div
            key={status}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: theme.spacing[1],
              padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
              border: `1px solid ${theme.border.color.light}`,
              borderRadius: theme.border.radius.md,
              background: theme.background.secondary,
            }}
          >
            <span
              style={{
                fontSize: theme.font.size.lg,
                fontWeight: theme.font.weight.semiBold,
                color: theme.color[CORES_STATUS_META[status].cor],
              }}
            >
              {contagem(status)}
            </span>
            <Text size="sm" color="secondary">
              {CORES_STATUS_META[status].rotulo}
            </Text>
          </div>
        ))}
      </div>

      {metas.length === 0 && (
        <Callout
          status="info"
          title="Nenhuma meta cadastrada"
          description="Crie metas em Metas › Todas. Escolha uma fonte automática (ex.: faturamento bruto) para o valor atual ser calculado sozinho."
        />
      )}

      {grupos.map(({ periodo, metas: metasDoPeriodo }) => (
        <section key={periodo} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
          <Titulo
            titulo={periodo}
            descricao={`${metasDoPeriodo.length} meta(s) principal(is)`}
            
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: theme.spacing[3],
            }}
          >
            {metasDoPeriodo.map((meta) => {
              const submetas = submetasDe(meta.id);

              return (
                <div
                  key={meta.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing[3],
                    padding: theme.spacing[3],
                    border: `1px solid ${theme.border.color.light}`,
                    borderRadius: theme.border.radius.md,
                    background: theme.background.secondary,
                    minWidth: 0,
                  }}
                >
                  <LinhaMeta
                    meta={meta}
                    hoje={hoje}
                    destaque
                    quantidadeSubmetas={submetas.length}
                    onAbrir={() => abrirMeta(meta.id)}
                  />
                  {submetas.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: theme.spacing[2],
                        paddingLeft: theme.spacing[3],
                        borderLeft: `2px solid ${theme.border.color.medium}`,
                      }}
                    >
                      {submetas.map((submeta) => (
                        <LinhaMeta
                          key={submeta.id}
                          meta={submeta}
                          hoje={hoje}
                          onAbrir={() => abrirMeta(submeta.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <Text size="xs" color="light">
        A linha vertical na barra marca quanto do período já passou. Metas automáticas são
        recalculadas de hora em hora e sempre que a meta é editada.
      </Text>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: METAS_IDS.FRONT_PAINEL_METAS,
  name: 'painel-metas',
  description: 'Visão geral das metas por período, com progresso, tempo decorrido e submetas.',
  component: PainelMetas,
  widgetAvailability: { pageLayoutType: PageLayoutType.DASHBOARD },
});
