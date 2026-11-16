import { useMemo, useState } from 'react';
import { defineFrontComponent, PageLayoutType } from 'twenty-sdk/define';
import { openCommandConfirmationModal, useRecordId } from 'twenty-sdk/front-component';
import { Callout } from 'twenty-ui/components/feedback';
import { SearchInput } from 'twenty-ui/components/input';
import { IconKey, IconLock, IconPlus } from 'twenty-ui/icon';
import { Loader } from 'twenty-ui/primitives/feedback';
import { Button } from 'twenty-ui/primitives/input';
import { Heading, Text } from 'twenty-ui/primitives/typography';
import { useTheme } from 'twenty-ui/theme';

import { COFRE_UNIVERSAL_IDENTIFIERS } from 'src/modules/cofre/constants/cofre-universal-identifiers';
import { CartaoItemCofre } from 'src/modules/cofre/front-components/components/CartaoItemCofre';
import { FormularioItemCofre } from 'src/modules/cofre/front-components/components/FormularioItemCofre';
import { TelaSenhaCofre } from 'src/modules/cofre/front-components/components/TelaSenhaCofre';
import { useCofre } from 'src/modules/cofre/front-components/hooks/use-cofre';
import {
  type DadosItemCofre,
  filtrarItensCofre,
  ITEM_COFRE_VAZIO,
  removerItemCofre,
  salvarItemCofre,
} from 'src/modules/cofre/utils/acoes-itens-cofre.util';
import { OBJECTS } from 'src/modules/shared/constants/objects';

// id do sandbox: crypto.randomUUID pode faltar (origem opaca), então usa getRandomValues.
const gerarId = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

type Edicao = { id: string | null; inicial: DadosItemCofre } | null;

const Cofre = () => {
  const theme = useTheme();
  const recordId = useRecordId();
  const cofre = useCofre(recordId);
  const [busca, setBusca] = useState('');
  const [edicao, setEdicao] = useState<Edicao>(null);
  const [trocandoSenha, setTrocandoSenha] = useState(false);
  const { estado } = cofre;

  // Ao travar (botão ou tempo), some também o que estava em edição: tinha senha em claro.
  if (estado.tipo !== 'aberto' && (edicao !== null || trocandoSenha || busca !== '')) {
    setEdicao(null);
    setTrocandoSenha(false);
    setBusca('');
  }

  const itensVisiveis = useMemo(
    () => (estado.tipo === 'aberto' ? filtrarItensCofre(estado.conteudo.itens, busca) : []),
    [estado, busca],
  );

  const raiz = (conteudo: React.ReactNode) => (
    <div
      onPointerDown={cofre.registrarAtividade}
      onKeyDown={cofre.registrarAtividade}
      style={{
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
        color: theme.font.color.primary,
      }}
    >
      {conteudo}
    </div>
  );

  if (!recordId || estado.tipo === 'carregando') {
    return raiz(
      <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing[8] }}>
        <Loader />
      </div>,
    );
  }

  if (estado.tipo === 'erro') {
    return raiz(
      <div style={{ padding: theme.spacing[4] }}>
        <Callout
          status="error"
          title="Não foi possível abrir o cofre"
          description={estado.mensagem}
          action={<Button onClick={() => void cofre.carregar()}>Tentar de novo</Button>}
        />
      </div>,
    );
  }

  if (estado.tipo === 'novo') {
    return raiz(
      <TelaSenhaCofre
        modo="criar"
        nomeCofre={estado.registro.nome}
        esvaziado={estado.esvaziado}
        ocupado={cofre.ocupado}
        aoConfirmar={cofre.criar}
      />,
    );
  }

  if (estado.tipo === 'travado') {
    return raiz(
      <TelaSenhaCofre
        modo="abrir"
        nomeCofre={estado.registro.nome}
        ocupado={cofre.ocupado}
        aoConfirmar={(senha) => cofre.abrir(senha)}
      />,
    );
  }

  if (trocandoSenha) {
    return raiz(
      <TelaSenhaCofre
        modo="trocar"
        nomeCofre={estado.registro.nome}
        ocupado={cofre.ocupado}
        aoCancelar={() => setTrocandoSenha(false)}
        aoConfirmar={async (atual, nova) => {
          const erro = await cofre.trocarSenha(atual, nova);

          if (!erro) {
            setTrocandoSenha(false);
          }

          return erro;
        }}
      />,
    );
  }

  const salvarEdicao = async (dados: DadosItemCofre): Promise<string | null> => {
    if (edicao === null) {
      return null;
    }

    let conteudo;

    try {
      conteudo = salvarItemCofre(estado.conteudo, edicao.id, dados, new Date().toISOString(), gerarId);
    } catch (erro) {
      return erro instanceof Error ? erro.message : String(erro);
    }

    const resultado = await cofre.salvar(conteudo);

    if (!resultado) {
      setEdicao(null);
    }

    return resultado;
  };

  const remover = async (id: string, nome: string) => {
    const resposta = await openCommandConfirmationModal({
      title: `Apagar "${nome}"?`,
      subtitle: 'O acesso some do cofre para todo mundo. Não dá para desfazer.',
      confirmButtonText: 'Apagar',
      confirmButtonAccent: 'danger',
    });

    if (resposta === 'confirm') {
      await cofre.salvar(removerItemCofre(estado.conteudo, id));
    }
  };

  return raiz(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[4],
        padding: theme.spacing[4],
        maxWidth: 960,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing[2] }}>
        <div style={{ flex: '1 1 200px', minWidth: 0 }}>
          <Heading level={2} size="md">
            {estado.registro.nome || 'Cofre'}
          </Heading>
          <Text size="sm" color="tertiary">
            {estado.conteudo.itens.length === 1 ? '1 acesso' : `${estado.conteudo.itens.length} acessos`} · trava
            sozinho após 5 min parado
          </Text>
        </div>
        <Button
          variant="solid"
          color="accent"
          startIcon={<IconPlus size={16} />}
          disabled={cofre.ocupado || edicao !== null}
          onClick={() => setEdicao({ id: null, inicial: ITEM_COFRE_VAZIO })}
        >
          Novo acesso
        </Button>
        <Button variant="ghost" color="neutral" startIcon={<IconKey size={16} />} disabled={cofre.ocupado} onClick={() => setTrocandoSenha(true)}>
          Trocar senha
        </Button>
        <Button variant="outline" color="neutral" startIcon={<IconLock size={16} />} onClick={cofre.travar}>
          Travar
        </Button>
      </div>

      {edicao !== null ? (
        <FormularioItemCofre
          key={edicao.id ?? 'novo'}
          inicial={edicao.inicial}
          novo={edicao.id === null}
          ocupado={cofre.ocupado}
          aoSalvar={salvarEdicao}
          aoCancelar={() => setEdicao(null)}
        />
      ) : null}

      {estado.conteudo.itens.length > 0 ? (
        <SearchInput
          aria-label="Buscar acessos"
          placeholder="Buscar por nome, endereço, usuário…"
          value={busca}
          onValueChange={(valor: string) => setBusca(valor)}
        />
      ) : null}

      {estado.conteudo.itens.length === 0 && edicao === null ? (
        <div style={{ padding: theme.spacing[6], textAlign: 'center' }}>
          <Text color="tertiary">Nenhum acesso guardado ainda. Clique em “Novo acesso”.</Text>
        </div>
      ) : null}

      {estado.conteudo.itens.length > 0 && itensVisiveis.length === 0 ? (
        <Text color="tertiary" size="sm">
          Nenhum acesso encontrado para essa busca.
        </Text>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: theme.spacing[3] }}>
        {itensVisiveis.map((item) => (
          <CartaoItemCofre
            key={item.id}
            item={item}
            ocupado={cofre.ocupado || edicao !== null}
            aoEditar={() => {
              setEdicao({
                id: item.id,
                inicial: {
                  nome: item.nome,
                  endereco: item.endereco,
                  usuario: item.usuario,
                  senha: item.senha,
                  observacoes: item.observacoes,
                },
              });
            }}
            aoRemover={() => void remover(item.id, item.nome)}
          />
        ))}
      </div>
    </div>,
  );
};

export default defineFrontComponent({
  universalIdentifier: COFRE_UNIVERSAL_IDENTIFIERS.editor.frontComponent,
  name: 'cofre-acessos',
  description: 'Cofre de acessos criptografado no navegador com a senha do cofre.',
  component: Cofre,
  widgetAvailability: {
    pageLayoutType: PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifiers: [OBJECTS.cofre.universalIdentifier],
  },
});
