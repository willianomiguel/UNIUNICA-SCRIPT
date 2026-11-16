import { useState } from 'react';
import { Callout } from 'integra-ui/components/feedback';
import { Button, Textarea } from 'integra-ui/primitives/input';
import { Heading, Text } from 'integra-ui/primitives/typography';
import { useTheme } from 'integra-ui/theme';

import { CampoCofre } from 'src/modules/cofre/front-components/components/CampoCofre';
import { type DadosItemCofre } from 'src/modules/cofre/utils/acoes-itens-cofre.util';

export const FormularioItemCofre = ({
  inicial,
  novo,
  ocupado,
  aoSalvar,
  aoCancelar,
}: {
  inicial: DadosItemCofre;
  novo: boolean;
  ocupado: boolean;
  aoSalvar: (dados: DadosItemCofre) => Promise<string | null>;
  aoCancelar: () => void;
}) => {
  const theme = useTheme();
  const [dados, setDados] = useState<DadosItemCofre>(inicial);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const campo = (nome: keyof DadosItemCofre) => (valor: string) => setDados((atual) => ({ ...atual, [nome]: valor }));

  const salvar = async () => {
    if (dados.nome.trim() === '') {
      setErro('Dê um nome ao acesso.');

      return;
    }

    setErro(null);
    const resultado = await aoSalvar(dados);

    if (resultado) {
      setErro(resultado);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[3],
        padding: theme.spacing[4],
        border: `1px solid ${theme.border.color.medium}`,
        borderRadius: theme.border.radius.md,
        background: theme.background.secondary,
      }}
    >
      <Heading level={3} size="sm">
        {novo ? 'Novo acesso' : 'Editar acesso'}
      </Heading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing[3] }}>
        <CampoCofre rotulo="Nome" placeholder="Ex.: VM Produção" valor={dados.nome} aoMudar={campo('nome')} desabilitado={ocupado} />
        <CampoCofre
          rotulo="Endereço (IP, host ou link)"
          placeholder="Ex.: 10.0.0.5:3389"
          valor={dados.endereco}
          aoMudar={campo('endereco')}
          desabilitado={ocupado}
        />
        <CampoCofre rotulo="Usuário" valor={dados.usuario} aoMudar={campo('usuario')} desabilitado={ocupado} />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: theme.spacing[1], minWidth: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <CampoCofre
              rotulo="Senha"
              tipo={mostrarSenha ? 'text' : 'password'}
              valor={dados.senha}
              aoMudar={campo('senha')}
              desabilitado={ocupado}
              autoCompleteSenha="off"
            />
          </div>
          <Button variant="ghost" color="neutral" size="sm" onClick={() => setMostrarSenha((atual) => !atual)}>
            {mostrarSenha ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1] }}>
        <Text size="sm" color="secondary">
          Observações
        </Text>
        <Textarea
          value={dados.observacoes}
          disabled={ocupado}
          placeholder="Porta, chave SSH, quem usa…"
          onValueChange={(valor: string) => campo('observacoes')(valor)}
        />
      </label>
      {erro ? <Callout status="error" title={erro} /> : null}
      <div style={{ display: 'flex', gap: theme.spacing[2], justifyContent: 'flex-end' }}>
        <Button variant="ghost" color="neutral" disabled={ocupado} onClick={aoCancelar}>
          Cancelar
        </Button>
        <Button variant="solid" color="accent" loading={ocupado} onClick={() => void salvar()}>
          {ocupado ? 'Salvando…' : 'Salvar'}
        </Button>
      </div>
    </div>
  );
};
