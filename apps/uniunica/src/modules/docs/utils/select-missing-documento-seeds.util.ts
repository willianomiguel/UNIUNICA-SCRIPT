import { type DocumentoSeed } from 'src/modules/docs/types/documento-seed';
import { normalizeSearchText } from 'src/modules/docs/utils/normalize-search-text.util';

// Devolve só os seeds cujo título ainda não existe (comparação sem acento/caixa).
export const selectMissingDocumentoSeeds = (
  seeds: DocumentoSeed[],
  existingTitles: string[],
): DocumentoSeed[] => {
  const existing = new Set(existingTitles.map(normalizeSearchText));

  return seeds.filter((seed) => !existing.has(normalizeSearchText(seed.titulo)));
};
