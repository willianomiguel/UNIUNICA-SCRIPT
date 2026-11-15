import { PREFIXO_CHAVE_POR_ORIGEM } from 'src/modules/trafego/constants/trafego-constantes';
import { type OrigemMetrica } from 'src/modules/trafego/types/origem-metrica';

// Chave estável para upsert idempotente, ex.: "meta:120210:2026-11-14".
export const montarChaveMetrica = ({
  origem,
  referencia,
  data,
}: {
  origem: OrigemMetrica;
  referencia: string | null | undefined;
  data: string;
}): string => {
  const ref = (referencia ?? '').trim().toLowerCase() || 'geral';

  return `${PREFIXO_CHAVE_POR_ORIGEM[origem]}:${ref}:${data}`;
};
