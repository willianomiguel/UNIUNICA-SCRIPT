import { TAREFA_CODIGO_PREFIXO } from 'src/modules/sprints/constants/tarefa-codigo-prefixo';

// 42 -> "UNI-42"
export const formatarCodigoTarefa = (numero: number): string => {
  if (!Number.isInteger(numero) || numero < 1) {
    throw new Error(`Número de tarefa inválido: ${numero}`);
  }

  return `${TAREFA_CODIGO_PREFIXO}-${numero}`;
};
