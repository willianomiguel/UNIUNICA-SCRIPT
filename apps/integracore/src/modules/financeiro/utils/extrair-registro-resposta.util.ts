import { type RegistroIntegraCore } from 'src/modules/financeiro/types/registro-integracore';

// Respostas REST de um registro vêm como { data: { <operação>: registro } }.
export const extrairRegistroResposta = (
  resposta: unknown,
): RegistroIntegraCore | null => {
  const data = (resposta as { data?: Record<string, unknown> } | null)?.data;

  if (!data || typeof data !== 'object') {
    return null;
  }

  const registro = Object.values(data)[0] as RegistroIntegraCore | undefined;

  return registro && typeof registro.id === 'string' ? registro : null;
};
