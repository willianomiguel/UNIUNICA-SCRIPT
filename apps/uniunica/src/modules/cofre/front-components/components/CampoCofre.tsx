import { Input } from 'twenty-ui/primitives/input';
import { Text } from 'twenty-ui/primitives/typography';
import { useTheme } from 'twenty-ui/theme';

// Campo com rótulo visível. autoComplete off pede ao navegador para não oferecer salvar a senha (melhor esforço).
export const CampoCofre = ({
  rotulo,
  valor,
  aoMudar,
  tipo = 'text',
  placeholder,
  desabilitado,
  aoEnter,
  autoCompleteSenha = 'off',
}: {
  rotulo: string;
  valor: string;
  aoMudar: (valor: string) => void;
  tipo?: 'text' | 'password';
  placeholder?: string;
  desabilitado?: boolean;
  aoEnter?: () => void;
  autoCompleteSenha?: 'off' | 'new-password' | 'current-password';
}) => {
  const theme = useTheme();

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1], minWidth: 0 }}>
      <Text size="sm" color="secondary">
        {rotulo}
      </Text>
      <Input
        type={tipo}
        value={valor}
        placeholder={placeholder}
        disabled={desabilitado}
        autoComplete={tipo === 'password' ? autoCompleteSenha : 'off'}
        spellCheck={false}
        onValueChange={(novo: string) => aoMudar(novo)}
        onKeyDown={(evento) => {
          if (evento.key === 'Enter' && aoEnter) {
            aoEnter();
          }
        }}
      />
    </label>
  );
};
