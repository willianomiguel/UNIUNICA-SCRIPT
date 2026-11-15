import { type RoadmapRange } from 'src/modules/projetos/types/roadmap-range';
import { type TimelineSegment } from 'src/modules/projetos/types/timeline-segment';
import { dateToPercent } from 'src/modules/projetos/utils/date-to-percent.util';
import { getQuarterStart } from 'src/modules/projetos/utils/get-quarter-start.util';
import { getTrimestreLabel } from 'src/modules/projetos/utils/get-trimestre-label.util';

// Colunas de trimestres ('2026-T4') do cabeçalho do Roadmap.
export const buildQuarterSegments = (range: RoadmapRange): TimelineSegment[] => {
  const segments: TimelineSegment[] = [];
  let quarterStart = getQuarterStart(range.startMs);

  while (quarterStart < range.endMs) {
    const nextQuarterStart = getQuarterStart(quarterStart, 1);
    const left = dateToPercent(Math.max(quarterStart, range.startMs), range);
    const label = getTrimestreLabel(quarterStart);

    segments.push({
      key: label,
      label,
      leftPercent: left,
      widthPercent: dateToPercent(Math.min(nextQuarterStart, range.endMs), range) - left,
    });

    quarterStart = nextQuarterStart;
  }

  return segments;
};
