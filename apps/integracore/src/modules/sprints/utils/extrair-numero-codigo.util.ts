import { TAREFA_CODIGO_PREFIXO } from 'src/modules/sprints/constants/tarefa-codigo-prefixo';

// "UNI-42" -> 42; qualquer outro texto -> null
export const extrairNumeroCodigo = (
  codigo: string | null | undefined,
): number | null => {
  if (!codigo) {
    return null;
  }

  const match = new RegExp(`^${TAREFA_CODIGO_PREFIXO}-(\\d+)$`, 'i').exec(
    codigo.trim(),
  );

  if (!match) {
    return null;
  }

  const numero = Number(match[1]);

  return numero > 0 ? numero : null;
};
