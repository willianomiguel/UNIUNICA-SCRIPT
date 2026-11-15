import { type BarPosition } from 'src/modules/projetos/types/bar-position';
import { type RoadmapRange } from 'src/modules/projetos/types/roadmap-range';
import { dateToPercent } from 'src/modules/projetos/utils/date-to-percent.util';
import { parseDateOnly } from 'src/modules/projetos/utils/parse-date-only.util';

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_WIDTH_PERCENT = 0.8;

// Posição da barra de um projeto (dataInicio → dataFim, fim inclusivo).
// Com só uma das datas, a barra ocupa um dia. Sem datas ou fora do intervalo: null.
export const computeBarPosition = (
  dataInicio: string | null | undefined,
  dataFim: string | null | undefined,
  range: RoadmapRange,
): BarPosition | null => {
  const parsedStart = parseDateOnly(dataInicio);
  const parsedEnd = parseDateOnly(dataFim);

  if (parsedStart === null && parsedEnd === null) {
    return null;
  }

  let startMs = parsedStart ?? (parsedEnd as number);
  let endMs = parsedEnd ?? startMs;

  if (endMs < startMs) {
    [startMs, endMs] = [endMs, startMs];
  }

  const endExclusiveMs = endMs + DAY_MS;

  if (endExclusiveMs <= range.startMs || startMs >= range.endMs) {
    return null;
  }

  const left = dateToPercent(startMs, range);
  const right = dateToPercent(endExclusiveMs, range);
  const widthPercent = Math.max(right - left, MIN_WIDTH_PERCENT);

  return {
    leftPercent: Math.min(left, 100 - widthPercent),
    widthPercent,
    isClippedStart: startMs < range.startMs,
    isClippedEnd: endExclusiveMs > range.endMs,
  };
};
