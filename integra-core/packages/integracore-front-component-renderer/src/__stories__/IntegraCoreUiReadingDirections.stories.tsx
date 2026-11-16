import { type Meta } from '@storybook/react-vite';

import {
  FRONT_COMPONENT_STORY_DEFAULT_ARGS,
  resetFrontComponentStoryMocks,
} from '@/__stories__/shared/test-utils/createFrontComponentStoryMeta';
import { type IntegraCoreUiGalleryStory as Story } from '@/__stories__/integracore-ui-gallery/types/IntegraCoreUiGalleryStory';
import { createGalleryStory } from '@/__stories__/integracore-ui-gallery/utils/createGalleryStory';
import { readingDirectionsTest } from '@/__stories__/integracore-ui-gallery/utils/readingDirectionsTest';
import { FrontComponentRenderer } from '@/host/components/FrontComponentRenderer';

const meta: Meta<typeof FrontComponentRenderer> = {
  title: 'FrontComponent/IntegraCore UI Reading Directions',
  component: FrontComponentRenderer,
  args: FRONT_COMPONENT_STORY_DEFAULT_ARGS,
  beforeEach: resetFrontComponentStoryMocks,
};

export default meta;

export const ReadingDirectionsReact: Story = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-reading-directions',
  runtime: 'react',
  play: readingDirectionsTest,
});

export const ReadingDirectionsPreact: Story = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-reading-directions',
  runtime: 'preact',
  play: readingDirectionsTest,
});

export const ReadingDirectionsReactDark: Story = {
  ...ReadingDirectionsReact,
  args: {
    ...ReadingDirectionsReact.args,
    colorScheme: 'dark',
    executionContext: {
      ...FRONT_COMPONENT_STORY_DEFAULT_ARGS.executionContext!,
      colorScheme: 'dark',
    },
  },
};

export const ReadingDirectionsPreactDark: Story = {
  ...ReadingDirectionsPreact,
  args: {
    ...ReadingDirectionsPreact.args,
    colorScheme: 'dark',
    executionContext: {
      ...FRONT_COMPONENT_STORY_DEFAULT_ARGS.executionContext!,
      colorScheme: 'dark',
    },
  },
};
