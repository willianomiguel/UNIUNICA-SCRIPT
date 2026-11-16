import { ObjectMetadataIcon } from '@/object-metadata/components/ObjectMetadataIcon';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { isDefined } from 'integracore-shared/utils';
import { useIcons } from 'integracore-ui/icon/provider';
import { useTheme } from 'integracore-ui/theme';

export const EventIconDynamicComponent = ({
  eventIcon,
  linkedObjectMetadataItem,
}: {
  eventIcon: string | null;
  linkedObjectMetadataItem: EnrichedObjectMetadataItem | null;
}) => {
  const { getIcon } = useIcons();
  const theme = useTheme();

  if (!isDefined(eventIcon)) {
    return <ObjectMetadataIcon objectMetadataItem={linkedObjectMetadataItem} />;
  }

  const EventIcon = getIcon(eventIcon);

  return <EventIcon size={theme.icon.size.md} />;
};
