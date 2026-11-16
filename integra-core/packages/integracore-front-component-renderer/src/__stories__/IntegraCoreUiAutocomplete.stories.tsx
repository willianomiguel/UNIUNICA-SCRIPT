import { type Meta } from '@storybook/react-vite';

import {
  FRONT_COMPONENT_STORY_DEFAULT_ARGS,
  resetFrontComponentStoryMocks,
} from '@/__stories__/shared/test-utils/createFrontComponentStoryMeta';
import { type IntegraCoreUiGalleryStory } from '@/__stories__/integracore-ui-gallery/types/IntegraCoreUiGalleryStory';
import { autocompleteCompositionTest } from '@/__stories__/integracore-ui-gallery/utils/autocompleteCompositionTest';
import { autocompleteDismissalTest } from '@/__stories__/integracore-ui-gallery/utils/autocompleteDismissalTest';
import { autocompleteEmptyTest } from '@/__stories__/integracore-ui-gallery/utils/autocompleteEmptyTest';
import { autocompleteInputTest } from '@/__stories__/integracore-ui-gallery/utils/autocompleteInputTest';
import { autocompletePartsTest } from '@/__stories__/integracore-ui-gallery/utils/autocompletePartsTest';
import { createGalleryStory } from '@/__stories__/integracore-ui-gallery/utils/createGalleryStory';
import { FrontComponentRenderer } from '@/host/components/FrontComponentRenderer';

const meta: Meta<typeof FrontComponentRenderer> = {
  title: 'FrontComponent/IntegraCore UI Autocomplete',
  component: FrontComponentRenderer,
  parameters: { layout: 'centered' },
  args: FRONT_COMPONENT_STORY_DEFAULT_ARGS,
  beforeEach: resetFrontComponentStoryMocks,
};

export default meta;

export const InputReact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-autocomplete',
  runtime: 'react',
  play: autocompleteInputTest,
});

export const InputPreact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-autocomplete',
  runtime: 'preact',
  play: autocompleteInputTest,
});

export const CompositionReact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-autocomplete',
  runtime: 'react',
  play: autocompleteCompositionTest,
});

export const CompositionPreact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-autocomplete',
  runtime: 'preact',
  play: autocompleteCompositionTest,
});

export const EmptyReact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-autocomplete',
  runtime: 'react',
  play: autocompleteEmptyTest,
});

export const EmptyPreact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-autocomplete',
  runtime: 'preact',
  play: autocompleteEmptyTest,
});

export const PartsReact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-autocomplete-parts',
  runtime: 'react',
  play: autocompletePartsTest,
});

export const PartsPreact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-autocomplete-parts',
  runtime: 'preact',
  play: autocompletePartsTest,
});

export const DismissalReact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-autocomplete-parts',
  runtime: 'react',
  play: autocompleteDismissalTest,
});

export const DismissalPreact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-autocomplete-parts',
  runtime: 'preact',
  play: autocompleteDismissalTest,
});
