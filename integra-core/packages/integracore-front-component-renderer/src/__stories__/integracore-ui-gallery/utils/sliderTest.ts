import { errorHandler } from '@/__stories__/shared/test-utils/createFrontComponentStoryMeta';
import { INTERACTION_TIMEOUT } from '@/__stories__/shared/test-utils/timeouts';
import { type IntegraCoreUiGalleryPlayFunction } from '@/__stories__/integracore-ui-gallery/types/IntegraCoreUiGalleryPlayFunction';
import { expectSliderGalleryMounted } from '@/__stories__/integracore-ui-gallery/utils/expectSliderGalleryMounted';
import { expect, waitFor } from 'storybook/test';

export const sliderTest: IntegraCoreUiGalleryPlayFunction = async ({
  canvasElement,
}) => {
  const slider = await expectSliderGalleryMounted(canvasElement);

  await waitFor(() => expect(slider).toBeVisible(), {
    timeout: INTERACTION_TIMEOUT,
  });
  expect(errorHandler).not.toHaveBeenCalled();
};
