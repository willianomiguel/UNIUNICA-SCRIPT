import { LIMITES_ASSISTENTE } from 'src/modules/assistente/constants/assistente-limites';
import { type IntervaloIso } from 'src/modules/assistente/types/intervalo-iso';
import { type ResultadoValidacao } from 'src/modules/assistente/types/resultado-validacao';
import { validarPeriodo } from 'src/modules/assistente/utils/validar-periodo.util';

// Período (padrão: últimos 30 dias) mais o filtro opcional `campanha` (texto no nome).
export const validarEntradaTrafego = (
  entrada: unknown,
  hoje: string,
): ResultadoValidacao<{ intervalo: IntervaloIso; campanha: string | null }> => {
  const periodo = validarPeriodo(entrada, hoje, { tipo: 'ULTIMOS_DIAS', dias: LIMITES_ASSISTENTE.diasPadraoTrafego });

  if (!periodo.ok) {
    return periodo;
  }

  const campanha = (entrada as Record<string, unknown> | null | undefined)?.campanha;

  if (campanha !== undefined && campanha !== null && typeof campanha !== 'string') {
    return { ok: false, erro: '"campanha" deve ser um texto.' };
  }

  const texto = typeof campanha === 'string' && campanha.trim() !== '' ? campanha.trim() : null;

  if (texto !== null && texto.length > LIMITES_ASSISTENTE.buscaMaxima) {
    return { ok: false, erro: `"campanha" passou de ${LIMITES_ASSISTENTE.buscaMaxima} caracteres.` };
  }

  return { ok: true, valor: { intervalo: periodo.valor, campanha: texto } };
};
