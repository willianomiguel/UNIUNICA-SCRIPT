import { isNonEmptyString } from '@sniptt/guards';
import { expect, waitFor, within } from 'storybook/test';

import { errorHandler } from '@/__stories__/shared/test-utils/createFrontComponentStoryMeta';
import { MOUNT_TIMEOUT } from '@/__stories__/shared/test-utils/timeouts';
import { type IntegraCoreUiGalleryPlayFunction } from '@/__stories__/integracore-ui-gallery/types/IntegraCoreUiGalleryPlayFunction';

type CreateGalleryRenderTestOptions = {
  expectedFailedComponents: readonly string[];
};

// Exact failure sets catch regressions and make fixes require updated assertions.
export const createGalleryRenderTest =
  ({
    expectedFailedComponents,
  }: CreateGalleryRenderTestOptions): IntegraCoreUiGalleryPlayFunction =>
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = await canvas.findByTestId(
      'gallery-status',
      {},
      { timeout: MOUNT_TIMEOUT },
    );

    await waitFor(() => {
      const failedComponents = (status.getAttribute('data-failed-names') ?? '')
        .split(', ')
        .filter(isNonEmptyString)
        .sort();

      expect(failedComponents).toEqual([...expectedFailedComponents].sort());
      expect(status).toHaveAttribute(
        'data-failed-count',
        String(expectedFailedComponents.length),
      );
      if (expectedFailedComponents.length === 0) {
        expect(status).toHaveAttribute('data-failed-messages', '');
      }
    });

    expect(Number(status.getAttribute('data-total-count'))).toBeGreaterThan(0);
    expect(errorHandler).not.toHaveBeenCalled();
  };
