type Opcao = { value: string; label: string };

export const rotuloOpcao = (opcoes: Opcao[], valor: string): string =>
  opcoes.find((opcao) => opcao.value === valor)?.label ??
  (valor === 'SEM_VALOR' ? 'Não informado' : valor);
