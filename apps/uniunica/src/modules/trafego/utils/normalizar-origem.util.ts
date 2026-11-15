import { ORIGENS_METRICA } from 'src/modules/trafego/constants/trafego-constantes';
import { type OrigemMetrica } from 'src/modules/trafego/types/origem-metrica';

const APELIDOS: Record<string, OrigemMetrica> = {
  META: 'META_ADS',
  FACEBOOK: 'META_ADS',
  INSTAGRAM: 'META_ADS',
  GOOGLE: 'GOOGLE_ADS',
  TIKTOK: 'TIKTOK_ADS',
};

// Aceita "META_ADS", "meta", "google-ads"… e devolve a origem válida ou o padrão.
export const normalizarOrigem = (
  valor: unknown,
  padrao: OrigemMetrica = 'MANUAL',
): OrigemMetrica => {
  if (typeof valor !== 'string') {
    return padrao;
  }

  const texto = valor.trim().toUpperCase().replace(/[\s-]+/g, '_');

  if ((ORIGENS_METRICA as readonly string[]).includes(texto)) {
    return texto as OrigemMetrica;
  }

  return APELIDOS[texto] ?? padrao;
};
