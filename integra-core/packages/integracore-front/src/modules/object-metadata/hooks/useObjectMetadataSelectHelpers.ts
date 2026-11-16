import { type IconComponent } from 'integracore-ui/icon';
import { useIcons } from 'integracore-ui/icon/provider';
import { type ThemeColor } from 'integracore-ui/theme';

import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { getObjectColorWithFallback } from '@/object-metadata/utils/getObjectColorWithFallback';

type ObjectMetadataItemForSelectIcon = Pick<
  EnrichedObjectMetadataItem,
  'icon' | 'nameSingular' | 'color' | 'isSystem'
>;

export const useObjectMetadataSelectHelpers = () => {
  const { getIcon } = useIcons();

  const getSelectIconPropsFromObjectMetadataItem = (
    objectMetadataItem: ObjectMetadataItemForSelectIcon,
  ): { Icon: IconComponent; iconThemeColor: ThemeColor } => ({
    Icon: getIcon(objectMetadataItem.icon),
    iconThemeColor: getObjectColorWithFallback(objectMetadataItem),
  });

  return { getSelectIconPropsFromObjectMetadataItem };
};
