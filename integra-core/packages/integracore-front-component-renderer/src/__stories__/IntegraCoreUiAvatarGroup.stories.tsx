import { type Meta } from '@storybook/react-vite';

import {
  FRONT_COMPONENT_STORY_DEFAULT_ARGS,
  resetFrontComponentStoryMocks,
} from '@/__stories__/shared/test-utils/createFrontComponentStoryMeta';
import { type IntegraCoreUiGalleryStory as Story } from '@/__stories__/integracore-ui-gallery/types/IntegraCoreUiGalleryStory';
import { avatarGroupTest } from '@/__stories__/integracore-ui-gallery/utils/avatarGroupTest';
import { createGalleryStory } from '@/__stories__/integracore-ui-gallery/utils/createGalleryStory';
import { FrontComponentRenderer } from '@/host/components/FrontComponentRenderer';

const meta: Meta<typeof FrontComponentRenderer> = {
  title: 'FrontComponent/IntegraCore UI AvatarGroup',
  component: FrontComponentRenderer,
  args: FRONT_COMPONENT_STORY_DEFAULT_ARGS,
  beforeEach: resetFrontComponentStoryMocks,
};

export default meta;

export const AvatarGroupReact: Story = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-avatar-group',
  runtime: 'react',
  play: avatarGroupTest,
});

export const AvatarGroupPreact: Story = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-avatar-group',
  runtime: 'preact',
  play: avatarGroupTest,
});
