import { SkeletonLine } from '@/ui/feedback/skeleton/components/SkeletonLine';
import { SKELETON_HEIGHT_SIZES } from 'integracore-ui/primitives/feedback';

import { StyledSkeletonDiv } from './RecordInlineCellContainer';

export const RecordInlineCellSkeletonLoader = () => {
  return (
    <StyledSkeletonDiv>
      <SkeletonLine width={154} height={SKELETON_HEIGHT_SIZES.s} />
    </StyledSkeletonDiv>
  );
};
