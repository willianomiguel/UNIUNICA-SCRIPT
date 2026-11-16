import { CRIPTO_COFRE } from 'src/modules/cofre/constants/cripto-cofre.constant';

// Devolve a mensagem de erro ou null quando a senha nova pode ser usada.
export const validarSenhaNovaCofre = (senha: string, confirmacao: string): string | null => {
  if (senha.length < CRIPTO_COFRE.TAMANHO_MINIMO_SENHA) {
    return `A senha do cofre precisa ter pelo menos ${CRIPTO_COFRE.TAMANHO_MINIMO_SENHA} caracteres.`;
  }

  if (senha.trim() !== senha) {
    return 'A senha não pode começar nem terminar com espaço.';
  }

  if (senha !== confirmacao) {
    return 'As duas senhas não são iguais.';
  }

  return null;
};
