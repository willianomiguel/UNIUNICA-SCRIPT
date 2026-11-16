import { type Meta } from '@storybook/react-vite';

import {
  FRONT_COMPONENT_STORY_DEFAULT_ARGS,
  resetFrontComponentStoryMocks,
} from '@/__stories__/shared/test-utils/createFrontComponentStoryMeta';
import { type IntegraCoreUiGalleryStory } from '@/__stories__/integracore-ui-gallery/types/IntegraCoreUiGalleryStory';
import { ScrollBoundaryDecorator } from '@/__stories__/integracore-ui-gallery/components/ScrollBoundaryDecorator';
import { autocompleteFilterResetTest } from '@/__stories__/integracore-ui-gallery/utils/autocompleteFilterResetTest';
import { autocompleteNestedRevealTest } from '@/__stories__/integracore-ui-gallery/utils/autocompleteNestedRevealTest';
import { autocompleteRevealTest } from '@/__stories__/integracore-ui-gallery/utils/autocompleteRevealTest';
import { createAutocompleteLongInputTest } from '@/__stories__/integracore-ui-gallery/utils/createAutocompleteLongInputTest';
import { createGalleryStory } from '@/__stories__/integracore-ui-gallery/utils/createGalleryStory';
import { selectAlignedOpenTest } from '@/__stories__/integracore-ui-gallery/utils/selectAlignedOpenTest';
import { selectRevealTest } from '@/__stories__/integracore-ui-gallery/utils/selectRevealTest';
import { tabsOverflowTest } from '@/__stories__/integracore-ui-gallery/utils/tabsOverflowTest';
import { FrontComponentRenderer } from '@/host/components/FrontComponentRenderer';

const meta: Meta<typeof FrontComponentRenderer> = {
  title: 'FrontComponent/IntegraCore UI Scrolling',
  component: FrontComponentRenderer,
  parameters: { layout: 'centered' },
  args: FRONT_COMPONENT_STORY_DEFAULT_ARGS,
  beforeEach: resetFrontComponentStoryMocks,
};

export default meta;

export const AutocompleteRevealReact: IntegraCoreUiGalleryStory = createGalleryStory(
  {
    frontComponentBundleName: 'integracore-ui-autocomplete-scrolling',
    runtime: 'react',
    play: autocompleteRevealTest,
  },
);

export const AutocompleteRevealPreact: IntegraCoreUiGalleryStory =
  createGalleryStory({
    frontComponentBundleName: 'integracore-ui-autocomplete-scrolling',
    runtime: 'preact',
    play: autocompleteRevealTest,
  });

export const AutocompleteNestedRevealReact: IntegraCoreUiGalleryStory =
  createGalleryStory({
    frontComponentBundleName: 'integracore-ui-autocomplete-scrolling',
    runtime: 'react',
    play: autocompleteNestedRevealTest,
    decorators: [ScrollBoundaryDecorator],
  });

export const AutocompleteNestedRevealPreact: IntegraCoreUiGalleryStory =
  createGalleryStory({
    frontComponentBundleName: 'integracore-ui-autocomplete-scrolling',
    runtime: 'preact',
    play: autocompleteNestedRevealTest,
    decorators: [ScrollBoundaryDecorator],
  });

export const AutocompleteFilterResetReact: IntegraCoreUiGalleryStory =
  createGalleryStory({
    frontComponentBundleName: 'integracore-ui-autocomplete-scrolling',
    runtime: 'react',
    play: autocompleteFilterResetTest,
  });

export const AutocompleteFilterResetPreact: IntegraCoreUiGalleryStory =
  createGalleryStory({
    frontComponentBundleName: 'integracore-ui-autocomplete-scrolling',
    runtime: 'preact',
    play: autocompleteFilterResetTest,
  });

export const AutocompleteLongInputReact: IntegraCoreUiGalleryStory =
  createGalleryStory({
    frontComponentBundleName: 'integracore-ui-autocomplete-scrolling',
    runtime: 'react',
    play: createAutocompleteLongInputTest({ isTrusted: false }),
  });

export const AutocompleteLongInputPreact: IntegraCoreUiGalleryStory =
  createGalleryStory({
    frontComponentBundleName: 'integracore-ui-autocomplete-scrolling',
    runtime: 'preact',
    play: createAutocompleteLongInputTest({ isTrusted: false }),
  });

export const AutocompleteTrustedLongInputReact: IntegraCoreUiGalleryStory = {
  ...createGalleryStory({
    frontComponentBundleName: 'integracore-ui-autocomplete-scrolling',
    runtime: 'react',
    play: createAutocompleteLongInputTest({ isTrusted: true }),
  }),
  tags: ['!dev'],
};

export const AutocompleteTrustedLongInputPreact: IntegraCoreUiGalleryStory = {
  ...createGalleryStory({
    frontComponentBundleName: 'integracore-ui-autocomplete-scrolling',
    runtime: 'preact',
    play: createAutocompleteLongInputTest({ isTrusted: true }),
  }),
  tags: ['!dev'],
};

export const SelectRevealReact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-select-scrolling',
  runtime: 'react',
  play: selectRevealTest,
});

export const SelectRevealPreact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-select-scrolling',
  runtime: 'preact',
  play: selectRevealTest,
});

export const SelectAlignedOpenReact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-select-scrolling',
  runtime: 'react',
  play: selectAlignedOpenTest,
});

export const SelectAlignedOpenPreact: IntegraCoreUiGalleryStory = createGalleryStory(
  {
    frontComponentBundleName: 'integracore-ui-select-scrolling',
    runtime: 'preact',
    play: selectAlignedOpenTest,
  },
);

export const TabsOverflowReact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-tabs-scrolling',
  runtime: 'react',
  play: tabsOverflowTest,
});

export const TabsOverflowPreact: IntegraCoreUiGalleryStory = createGalleryStory({
  frontComponentBundleName: 'integracore-ui-tabs-scrolling',
  runtime: 'preact',
  play: tabsOverflowTest,
});
