import { type RoadmapRange } from 'src/modules/projetos/types/roadmap-range';

// Posição (0–100%) de uma data dentro do intervalo do Roadmap, limitada às bordas.
export const dateToPercent = (ms: number, range: RoadmapRange): number => {
  const span = range.endMs - range.startMs;

  if (span <= 0) {
    return 0;
  }

  const percent = ((ms - range.startMs) / span) * 100;

  return Math.min(100, Math.max(0, percent));
};
