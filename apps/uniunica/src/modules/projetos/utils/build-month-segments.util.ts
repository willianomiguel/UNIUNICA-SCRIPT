import { type RoadmapRange } from 'src/modules/projetos/types/roadmap-range';
import { type TimelineSegment } from 'src/modules/projetos/types/timeline-segment';
import { dateToPercent } from 'src/modules/projetos/utils/date-to-percent.util';

const MONTH_LABELS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Colunas de meses do cabeçalho do Roadmap (janeiro mostra também o ano).
export const buildMonthSegments = (range: RoadmapRange): TimelineSegment[] => {
  const segments: TimelineSegment[] = [];

  if (range.endMs <= range.startMs) {
    return segments;
  }

  const cursor = new Date(range.startMs);
  let year = cursor.getUTCFullYear();
  let month = cursor.getUTCMonth();

  while (Date.UTC(year, month, 1) < range.endMs) {
    const startMs = Math.max(Date.UTC(year, month, 1), range.startMs);
    const endMs = Math.min(Date.UTC(year, month + 1, 1), range.endMs);
    const left = dateToPercent(startMs, range);
    const isFirst = segments.length === 0;

    segments.push({
      key: `${year}-${month + 1}`,
      label: month === 0 || isFirst ? `${MONTH_LABELS[month]} ${year}` : MONTH_LABELS[month],
      leftPercent: left,
      widthPercent: dateToPercent(endMs, range) - left,
    });

    month += 1;

    if (month === 12) {
      month = 0;
      year += 1;
    }
  }

  return segments;
};
