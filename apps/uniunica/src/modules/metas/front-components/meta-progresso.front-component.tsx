import { useCallback, useEffect, useState } from 'react';
import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineFrontComponent, PageLayoutType } from 'twenty-sdk/define';
import { AppPath, navigate, useRecordId } from 'twenty-sdk/front-component';
import { Callout } from 'twenty-ui/components/feedback';
import { LightButton } from 'twenty-ui/components/input';
import { Loader } from 'twenty-ui/primitives/feedback';
import { Text } from 'twenty-ui/primitives/typography';
import { useTheme } from 'twenty-ui/theme';

import { extrairRegistroResposta } from 'src/modules/financeiro/utils/extrair-registro-resposta.util';
import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { LinhaMeta } from 'src/modules/metas/front-components/components/linha-meta';
import { type MetaResumo } from 'src/modules/metas/types/meta-resumo';
import { calcularDiasRestantes } from 'src/modules/metas/utils/calcular-dias-restantes.util';
import { formatarValorMeta } from 'src/modules/metas/utils/formatar-valor-meta.util';
import { normalizarMeta } from 'src/modules/metas/utils/normalizar-meta.util';
import { OBJECTS } from 'src/modules/shared/constants/objects';

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'pronto'; meta: MetaResumo; submetas: MetaResumo[] };

const MetaProgresso = () => {
  const theme = useTheme();
  const recordId = useRecordId();
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });
  const hoje = hojeIso();

  const carregar = useCallback(() => {
    if (!recordId) {
      setEstado({ tipo: 'erro', mensagem: 'Abra uma meta para ver o progresso.' });

      return;
    }

    const cliente = new RestApiClient();

    setEstado({ tipo: 'carregando' });
    Promise.all([
      cliente.get(`/rest/metas/${recordId}`).then(extrairRegistroResposta),
      listarRegistros(cliente, 'metas', `metaPaiId[eq]:${JSON.stringify(recordId)}`),
    ])
      .then(([registro, submetas]) => {
        if (!registro) {
          setEstado({ tipo: 'erro', mensagem: 'Meta não encontrada.' });

          return;
        }

        setEstado({
          tipo: 'pronto',
          meta: normalizarMeta(registro),
          submetas: submetas.map(normalizarMeta),
        });
      })
      .catch((erro: unknown) =>
        setEstado({
          tipo: 'erro',
          mensagem: erro instanceof Error ? erro.message : String(erro),
        }),
      );
  }, [recordId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (estado.tipo === 'carregando') {
    return (
      <div style={{ padding: theme.spacing[3], display: 'flex', justifyContent: 'center' }}>
        <Loader />
      </div>
    );
  }

  if (estado.tipo === 'erro') {
    return (
      <div style={{ padding: theme.spacing[2] }}>
        <Callout
          status="error"
          title="Não foi possível mostrar o progresso"
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

  const { meta, submetas } = estado;
  const diasRestantes = calcularDiasRestantes(meta.dataFim, hoje);
  const falta =
    meta.valorAlvo !== null && meta.valorAtual !== null ? meta.valorAlvo - meta.valorAtual : null;

  const info = (rotulo: string, valor: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Text size="xs" color="tertiary">
        {rotulo}
      </Text>
      <Text size="sm" weight="medium" truncate>
        {valor}
      </Text>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[3],
        padding: theme.spacing[2],
        color: theme.font.color.primary,
      }}
    >
      <LinhaMeta meta={meta} hoje={hoje} destaque />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: theme.spacing[2],
        }}
      >
        {info('Falta', falta === null ? '—' : formatarValorMeta(Math.max(falta, 0), meta.unidade))}
        {info(
          'Prazo',
          diasRestantes === null
            ? 'Sem data final'
            : diasRestantes < 0
              ? `Encerrada há ${-diasRestantes} dia(s)`
              : `${diasRestantes} dia(s) restantes`,
        )}
        {info('Fonte', meta.fonte === 'MANUAL' ? 'Manual' : 'Automática (de hora em hora)')}
      </div>
      {submetas.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
          <Text size="xs" color="tertiary" weight="medium">
            Submetas ({submetas.length}) — o progresso desta meta é a média delas
          </Text>
          {submetas.map((submeta) => (
            <LinhaMeta
              key={submeta.id}
              meta={submeta}
              hoje={hoje}
              onAbrir={() =>
                navigate(AppPath.RecordShowPage, {
                  objectNameSingular: OBJECTS.meta.nameSingular,
                  objectRecordId: submeta.id,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: METAS_IDS.FRONT_PROGRESSO,
  name: 'meta-progresso',
  description: 'Progresso da meta: barra com marcador de tempo, quanto falta, prazo e submetas.',
  component: MetaProgresso,
  widgetAvailability: {
    pageLayoutType: PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifiers: [OBJECTS.meta.universalIdentifier],
  },
});
