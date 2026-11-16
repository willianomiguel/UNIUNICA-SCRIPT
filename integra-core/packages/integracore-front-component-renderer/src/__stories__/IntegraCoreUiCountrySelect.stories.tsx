import { type Meta } from '@storybook/react-vite';

import {
  FRONT_COMPONENT_STORY_DEFAULT_ARGS,
  resetFrontComponentStoryMocks,
} from '@/__stories__/shared/test-utils/createFrontComponentStoryMeta';
import { type IntegraCoreUiGalleryStory as Story } from '@/__stories__/integracore-ui-gallery/types/IntegraCoreUiGalleryStory';
import { countrySelectTest } from '@/__stories__/integracore-ui-gallery/utils/countrySelectTest';
import { createGalleryStory } from '@/__stories__/integracore-ui-gallery/utils/createGalleryStory';
import { FrontComponentRenderer } from '@/host/components/FrontComponentRenderer';

const meta: Meta<typeof FrontComponentRenderer> = {
  title: 'FrontComponent/IntegraCore UI Country Select',
  component: FrontComponentRenderer,
  args: FRONT_COMPONENT_STORY_DEFAULT_ARGS,
  beforeEach: resetFrontComponentStoryMocks,
};

export default meta;

export const CountrySelectReact: Story = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-country-select',
  runtime: 'react',
  play: countrySelectTest,
});

export const CountrySelectPreact: Story = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-country-select',
  runtime: 'preact',
  play: countrySelectTest,
});
