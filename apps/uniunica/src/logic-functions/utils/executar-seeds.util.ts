import { type ResultadoSeed } from 'src/logic-functions/types/resultado-seed';

type Seed = { modulo: string; executar: () => Promise<void> };

// Roda os seeds em ordem; uma falha não impede os próximos (cada seed é idempotente).
export const executarSeeds = async (seeds: Seed[]): Promise<ResultadoSeed[]> => {
  const resultados: ResultadoSeed[] = [];

  for (const { modulo, executar } of seeds) {
    try {
      await executar();
      resultados.push({ modulo, ok: true });
    } catch (error) {
      resultados.push({
        modulo,
        ok: false,
        erro: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return resultados;
};
