import { errorHandler } from '@/__stories__/shared/test-utils/createFrontComponentStoryMeta';
import { type IntegraCoreUiGalleryPlayFunction } from '@/__stories__/integracore-ui-gallery/types/IntegraCoreUiGalleryPlayFunction';
import { expectAssertionToKeepFailing } from '@/__stories__/integracore-ui-gallery/utils/expectAssertionToKeepFailing';
import { expectSliderGalleryMounted } from '@/__stories__/integracore-ui-gallery/utils/expectSliderGalleryMounted';
import { expect } from 'storybook/test';

export const sliderHiddenEdgeThumbTest: IntegraCoreUiGalleryPlayFunction = async ({
  canvasElement,
}) => {
  const slider = await expectSliderGalleryMounted(canvasElement);

  await expectAssertionToKeepFailing(() => expect(slider).toBeVisible());
  expect(errorHandler).not.toHaveBeenCalled();
};
