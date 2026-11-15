import { TAREFA_CODIGO_PREFIXO } from 'src/modules/sprints/constants/tarefa-codigo-prefixo';

// Encontra códigos como "UNI-42" (sem diferenciar maiúsculas) em títulos,
// branches e mensagens de commit. Devolve códigos únicos, em maiúsculas,
// na ordem em que aparecem.
export const extrairCodigosTarefa = (
  textos: Array<string | null | undefined>,
): string[] => {
  const regex = new RegExp(
    `(?<![A-Za-z0-9])${TAREFA_CODIGO_PREFIXO}-(\\d+)(?![0-9])`,
    'gi',
  );
  const codigos: string[] = [];

  for (const texto of textos) {
    if (!texto) {
      continue;
    }

    for (const match of texto.matchAll(regex)) {
      const numero = Number(match[1]);

      if (numero < 1) {
        continue;
      }

      const codigo = `${TAREFA_CODIGO_PREFIXO}-${numero}`;

      if (!codigos.includes(codigo)) {
        codigos.push(codigo);
      }
    }
  }

  return codigos;
};
