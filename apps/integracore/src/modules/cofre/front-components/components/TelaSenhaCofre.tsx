import { useState } from 'react';
import { Callout } from 'integra-ui/components/feedback';
import { IconLock } from 'integra-ui/icon';
import { Button } from 'integra-ui/primitives/input';
import { Heading, Text } from 'integra-ui/primitives/typography';
import { useTheme } from 'integra-ui/theme';

import { CampoCofre } from 'src/modules/cofre/front-components/components/CampoCofre';
import { validarSenhaNovaCofre } from 'src/modules/cofre/utils/validar-senha-cofre.util';

// Três usos: criar a senha de um cofre novo, abrir um cofre travado e trocar a senha.
export const TelaSenhaCofre = ({
  modo,
  nomeCofre,
  esvaziado = false,
  ocupado,
  aoConfirmar,
  aoCancelar,
}: {
  modo: 'criar' | 'abrir' | 'trocar';
  nomeCofre: string;
  esvaziado?: boolean;
  ocupado: boolean;
  aoConfirmar: (senha: string, senhaNova: string) => Promise<string | null>;
  aoCancelar?: () => void;
}) => {
  const theme = useTheme();
  const [senha, setSenha] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const confirmar = async () => {
    if (ocupado) {
      return;
    }

    if (modo !== 'abrir') {
      const nova = modo === 'criar' ? senha : senhaNova;
      const invalida = validarSenhaNovaCofre(nova, confirmacao);

      if (invalida) {
        setErro(invalida);

        return;
      }
    } else if (senha === '') {
      setErro('Digite a senha do cofre.');

      return;
    }

    setErro(null);
    const resultado = await aoConfirmar(senha, modo === 'trocar' ? senhaNova : senha);

    if (resultado) {
      setErro(resultado);
    } else {
      setSenha('');
      setSenhaNova('');
      setConfirmacao('');
    }
  };

  const titulo = { criar: 'Criar a senha do cofre', abrir: 'Cofre travado', trocar: 'Trocar a senha do cofre' }[modo];
  const botao = { criar: 'Criar cofre', abrir: 'Abrir cofre', trocar: 'Trocar senha' }[modo];
  const aguardando = { criar: 'Criando…', abrir: 'Abrindo…', trocar: 'Trocando…' }[modo];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing[6],
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4], width: '100%', maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <IconLock size={20} />
          <Heading level={2} size="md">
            {titulo}
          </Heading>
        </div>
        <Text color="tertiary" size="sm">
          {modo === 'abrir'
            ? `Digite a senha de "${nomeCofre}". Ela não fica salva em lugar nenhum.`
            : 'Os acessos são criptografados no seu navegador com esta senha antes de ir para o servidor. O banco, a IA e as chaves de API só veem o conteúdo embaralhado.'}
        </Text>

        {modo === 'criar' && esvaziado ? (
          <Callout
            status="error"
            title="Este cofre já foi alterado e está sem conteúdo"
            description="Se ele já tinha acessos guardados, alguém apagou o conteúdo. Não crie uma senha nova: avise o administrador antes."
          />
        ) : null}

        {modo !== 'abrir' ? (
          <Callout
            status="warning"
            title="Guarde esta senha"
            description="Se ela for perdida, não há como recuperar os acessos. Passe a senha pessoalmente só para quem pode abrir o cofre."
          />
        ) : null}

        <CampoCofre
          rotulo={modo === 'trocar' ? 'Senha atual' : 'Senha do cofre'}
          tipo="password"
          valor={senha}
          aoMudar={setSenha}
          desabilitado={ocupado}
          aoEnter={() => void confirmar()}
          autoCompleteSenha="off"
        />
        {modo === 'trocar' ? (
          <CampoCofre
            rotulo="Senha nova"
            tipo="password"
            valor={senhaNova}
            aoMudar={setSenhaNova}
            desabilitado={ocupado}
            autoCompleteSenha="off"
          />
        ) : null}
        {modo !== 'abrir' ? (
          <CampoCofre
            rotulo={modo === 'trocar' ? 'Repita a senha nova' : 'Repita a senha'}
            tipo="password"
            valor={confirmacao}
            aoMudar={setConfirmacao}
            desabilitado={ocupado}
            aoEnter={() => void confirmar()}
            autoCompleteSenha="off"
          />
        ) : null}

        {erro ? <Callout status="error" title={erro} /> : null}

        <div style={{ display: 'flex', gap: theme.spacing[2], justifyContent: 'flex-end' }}>
          {aoCancelar ? (
            <Button variant="ghost" color="neutral" disabled={ocupado} onClick={aoCancelar}>
              Cancelar
            </Button>
          ) : null}
          <Button variant="solid" color="accent" loading={ocupado} onClick={() => void confirmar()}>
            {ocupado ? aguardando : botao}
          </Button>
        </div>
      </div>
    </div>
  );
};
