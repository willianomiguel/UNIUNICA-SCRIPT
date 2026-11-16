import { type IntegraCoreUiGalleryPlayFunction } from '@/__stories__/integracore-ui-gallery/types/IntegraCoreUiGalleryPlayFunction';
import { type IntegraCoreUiGalleryStory } from '@/__stories__/integracore-ui-gallery/types/IntegraCoreUiGalleryStory';
import { getBuiltStoryComponentPathForRender } from '@/__stories__/utils/getBuiltStoryComponentPathForRender';

type CreateGalleryStoryOptions = {
  frontComponentBundleName: string;
  runtime: 'react' | 'preact';
  play?: IntegraCoreUiGalleryPlayFunction;
  decorators?: IntegraCoreUiGalleryStory['decorators'];
};

export const createGalleryStory = ({
  frontComponentBundleName,
  runtime,
  play,
  decorators,
}: CreateGalleryStoryOptions): IntegraCoreUiGalleryStory => ({
  args: {
    componentUrl: getBuiltStoryComponentPathForRender(
      `${frontComponentBundleName}.front-component`,
      runtime,
    ),
  },
  play,
  decorators,
});
