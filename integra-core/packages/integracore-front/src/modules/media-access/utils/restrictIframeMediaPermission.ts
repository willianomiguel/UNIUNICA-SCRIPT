import { type MediaCapability } from '@/media-access/types/MediaCapability';
import { type IframeMediaPermission } from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';

export const restrictIframeMediaPermission = ({
  permission,
  capabilities,
}: {
  permission: IframeMediaPermission | null;
  capabilities: readonly MediaCapability[];
}): IframeMediaPermission | null => {
  if (!isDefined(permission)) {
    return null;
  }

  const microphone =
    permission.microphone && capabilities.includes('microphone');
  const camera = permission.camera && capabilities.includes('camera');

  if (!microphone && !camera) {
    return null;
  }

  return { origin: permission.origin, microphone, camera };
};
