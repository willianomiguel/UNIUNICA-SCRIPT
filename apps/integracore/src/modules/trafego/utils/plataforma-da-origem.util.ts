import { type OrigemMetrica } from 'src/modules/trafego/types/origem-metrica';

// Plataforma usada ao criar automaticamente uma campanha a partir de uma métrica.
export const plataformaDaOrigem = (origem: OrigemMetrica): string => {
  switch (origem) {
    case 'META_ADS':
    case 'GOOGLE_ADS':
    case 'TIKTOK_ADS':
      return origem;
    case 'SITE':
      return 'ORGANICO';
    default:
      return 'OUTRO';
  }
};
