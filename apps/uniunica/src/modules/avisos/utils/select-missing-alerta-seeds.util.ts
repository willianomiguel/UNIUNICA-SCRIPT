import { type AlertaSeed } from 'src/modules/avisos/types/alerta-seed';

const normalize = (value: string): string =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Seeds cujo nome ainda não existe (sem acento/caixa), para o seed ser idempotente.
export const selectMissingAlertaSeeds = (
  seeds: AlertaSeed[],
  existingNames: string[],
): AlertaSeed[] => {
  const existing = new Set(existingNames.map(normalize));

  return seeds.filter((seed) => !existing.has(normalize(seed.nome)));
};
