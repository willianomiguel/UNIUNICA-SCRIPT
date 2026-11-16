import { expect, userEvent, waitFor, within } from 'storybook/test';

import { errorHandler } from '@/__stories__/shared/test-utils/createFrontComponentStoryMeta';
import { type IntegraCoreUiGalleryPlayFunction } from '@/__stories__/integracore-ui-gallery/types/IntegraCoreUiGalleryPlayFunction';
import { galleryRenderTest } from '@/__stories__/integracore-ui-gallery/utils/galleryRenderTests';

export const inputTest: IntegraCoreUiGalleryPlayFunction = async (context) => {
  await galleryRenderTest(context);

  const editorHeader = within(context.canvasElement).getByLabelText(
    'Code editor',
  );

  expect(editorHeader.tagName).toBe('HEADER');
  await expect(within(editorHeader).getByText('Editor')).toBeVisible();
  await expect(
    within(editorHeader).getByRole('button', { name: 'Format' }),
  ).toBeVisible();

  const segmentedControl = within(
    within(context.canvasElement).getByRole('radiogroup', { name: 'Choose' }),
  );
  const rightOption = segmentedControl.getByRole('radio', { name: 'Right' });

  await userEvent.click(rightOption);

  await waitFor(() => expect(rightOption).toBeChecked());
  expect(
    segmentedControl.getByRole('radio', { name: 'Left' }),
  ).not.toBeChecked();
  expect(errorHandler).not.toHaveBeenCalled();
};
