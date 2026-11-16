import { STANDARD_OBJECTS } from 'integracore-shared/metadata';
import { isDefined } from 'integracore-shared/utils';

export const hasTimelineActivityObjectMetadata = ({
  byUniversalIdentifier,
}: {
  byUniversalIdentifier: Partial<Record<string, unknown>>;
}): boolean =>
  isDefined(
    byUniversalIdentifier[
      STANDARD_OBJECTS.timelineActivity.universalIdentifier
    ],
  );
