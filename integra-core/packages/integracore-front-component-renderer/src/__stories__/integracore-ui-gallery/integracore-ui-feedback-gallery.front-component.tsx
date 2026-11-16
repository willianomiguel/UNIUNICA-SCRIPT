import { createElement } from 'react';
import { defineFrontComponent } from 'integracore-sdk/define';
import { InlineBanner } from 'integracore-ui/components/feedback';
import {
  Banner,
  Loader,
  ProgressBar,
  Skeleton,
} from 'integracore-ui/primitives/feedback';
import { isDefined } from 'integracore-shared/utils';
import 'integracore-ui/style.css';
import { ThemeProvider, themeCssVariables } from 'integracore-ui/theme';

import {
  ComponentGallery,
  type GalleryEntry,
} from '../shared/front-components/component-gallery';
import { CalloutGalleryExample } from './callout-gallery-example';

const FEEDBACK_ENTRIES: GalleryEntry[] = [
  {
    name: 'Banner',
    node: (
      <Banner
        status="error"
        color="blue"
        variant="soft"
        role="status"
        aria-live="polite"
        aria-label="Banner result"
        className="custom-banner"
        style={{ marginTop: 7 }}
        render={<section data-composed="true" />}
        ref={(element) => {
          if (isDefined(element)) element.dataset.refTag = element.tagName;
        }}
      >
        Heads up
      </Banner>
    ),
  },
  {
    name: 'Callout',
    node: <CalloutGalleryExample />,
  },
  {
    name: 'InlineBanner compact link',
    node: (
      <InlineBanner
        layout="compact"
        action={
          <InlineBanner.Action href={'#connection-settings'}>
            {'Connection settings'}
          </InlineBanner.Action>
        }
      >
        {'Connect your account to keep your contacts in sync.'}
      </InlineBanner>
    ),
  },
  {
    name: 'InlineBanner',
    node: <InlineBanner status="info">{'Inline message'}</InlineBanner>,
  },
  {
    name: 'Loader',
    node: (
      <Loader
        color="blue"
        role="status"
        aria-label="Loading results"
        className="custom-loader"
        style={{ borderColor: '#123456' }}
        render={(props) =>
          createElement('span', { ...props, 'data-composed': 'true' })
        }
        ref={(element) => {
          if (isDefined(element)) {
            element.dataset.refTag = element.tagName;
          }
        }}
      />
    ),
  },
  {
    name: 'DecorativeLoader',
    node: <Loader aria-hidden="true" />,
  },
  {
    name: 'ProgressBar',
    node: <ProgressBar value={50} aria-label="Progress" />,
  },
  {
    name: 'Skeleton',
    node: <Skeleton width={180} height={16} data-testid="round-skeleton" />,
  },
  {
    name: 'MediumRoundSkeleton',
    node: (
      <Skeleton
        width={180}
        height={16}
        borderRadius={themeCssVariables.border.radius.mdRound}
        data-testid="medium-round-skeleton"
      />
    ),
  },
  {
    name: 'CapsuleSkeleton',
    node: (
      <Skeleton
        width={24}
        height={84}
        borderRadius={80}
        data-testid="capsule-skeleton"
      />
    ),
  },
  {
    name: 'StaticSkeleton',
    node: (
      <Skeleton
        width={40}
        height={40}
        borderRadius="50%"
        animated={false}
        data-testid="circle-skeleton"
      />
    ),
  },
];

const FeedbackGallery = () => (
  <ThemeProvider colorScheme="light">
    <ComponentGallery
      title="integracore-ui/primitives/feedback"
      entries={FEEDBACK_ENTRIES}
    />
  </ThemeProvider>
);

export default defineFrontComponent({
  universalIdentifier: 'test-20ui0-0000-0000-0000-000000000102',
  name: 'integracore-ui-feedback-gallery',
  description:
    'Renders every integracore-ui/primitives/feedback component in the sandbox',
  component: FeedbackGallery,
});
