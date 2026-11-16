import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { useObjectMorphJunctionConfig } from '@/object-record/record-field/ui/hooks/useObjectMorphJunctionConfig';
import { getSearchableObjectMetadataItems } from '@/object-record/record-field/ui/utils/junction/getSearchableObjectMetadataItems';
import { StandardObjectNameSingular } from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';

export const useCalendarEventTargetObjectMetadataItems = () => {
  const { objectMetadataItems } = useObjectMetadataItems();
  const junctionConfig = useObjectMorphJunctionConfig({
    objectNameSingular: StandardObjectNameSingular.CalendarEvent,
  });

  if (!isDefined(junctionConfig)) {
    return [];
  }

  return getSearchableObjectMetadataItems({
    junctionConfig,
    objectMetadataItems,
  });
};
