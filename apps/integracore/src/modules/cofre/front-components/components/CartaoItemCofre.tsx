import { useState } from 'react';
import { copyToClipboard } from 'integra-sdk/front-component';
import { LightIconButton } from 'integra-ui/components/input';
import { IconCheck, IconCopy, IconEye, IconEyeOff, IconPencil, IconServer, IconTrash } from 'integra-ui/icon';
import { Text } from 'integra-ui/primitives/typography';
import { useTheme } from 'integra-ui/theme';

import { type ItemCofre } from 'src/modules/cofre/types/item-cofre';

// O IntegraCore não devolve se a cópia falhou (ele mesmo mostra o aviso de erro), então não anunciamos sucesso:
// só o ícone vira um "ok" por um instante para confirmar o clique.
const BotaoCopiar = ({ texto, rotulo }: { texto: string; rotulo: string }) => {
  const [clicado, setClicado] = useState(false);

  return (
    <LightIconButton
      aria-label={rotulo}
      onClick={() => {
        void copyToClipboard(texto);
        setClicado(true);
        setTimeout(() => setClicado(false), 1500);
      }}
    >
      {clicado ? <IconCheck size={16} /> : <IconCopy size={16} />}
    </LightIconButton>
  );
};

const Linha = ({
  rotulo,
  valor,
  oculto,
  acoes,
}: {
  rotulo: string;
  valor: string;
  oculto?: boolean;
  acoes?: React.ReactNode;
}) => {
  const theme = useTheme();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], minWidth: 0 }}>
      <div style={{ width: 72, flexShrink: 0 }}>
        <Text size="sm" color="tertiary">
          {rotulo}
        </Text>
      </div>
      <div style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere', fontFamily: theme.font.family }}>
        <Text size="sm">{oculto ? '••••••••••' : valor || '—'}</Text>
      </div>
      {valor ? acoes : null}
    </div>
  );
};

export const CartaoItemCofre = ({
  item,
  ocupado,
  aoEditar,
  aoRemover,
}: {
  item: ItemCofre;
  ocupado: boolean;
  aoEditar: () => void;
  aoRemover: () => void;
}) => {
  const theme = useTheme();
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[2],
        padding: theme.spacing[3],
        border: `1px solid ${theme.border.color.medium}`,
        borderRadius: theme.border.radius.md,
        background: theme.background.primary,
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
        <IconServer size={16} />
        <div style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
          <Text weight="medium">{item.nome}</Text>
        </div>
        <LightIconButton aria-label={`Editar ${item.nome}`} disabled={ocupado} onClick={aoEditar}>
          <IconPencil size={16} />
        </LightIconButton>
        <LightIconButton aria-label={`Apagar ${item.nome}`} disabled={ocupado} onClick={aoRemover}>
          <IconTrash size={16} />
        </LightIconButton>
      </div>
      <Linha
        rotulo="Endereço"
        valor={item.endereco}
        acoes={<BotaoCopiar texto={item.endereco} rotulo="Copiar endereço" />}
      />
      <Linha
        rotulo="Usuário"
        valor={item.usuario}
        acoes={<BotaoCopiar texto={item.usuario} rotulo="Copiar usuário" />}
      />
      <Linha
        rotulo="Senha"
        valor={item.senha}
        oculto={!mostrarSenha}
        acoes={
          <>
            <LightIconButton
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setMostrarSenha((atual) => !atual)}
            >
              {mostrarSenha ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            </LightIconButton>
            <BotaoCopiar texto={item.senha} rotulo="Copiar senha" />
          </>
        }
      />
      {item.observacoes ? (
        <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          <Text size="sm" color="secondary">
            {item.observacoes}
          </Text>
        </div>
      ) : null}
    </div>
  );
};
