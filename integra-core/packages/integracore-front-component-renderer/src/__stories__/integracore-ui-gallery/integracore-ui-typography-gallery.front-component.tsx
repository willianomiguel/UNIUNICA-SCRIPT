import 'integracore-ui/style.css';
import { defineFrontComponent } from 'integracore-sdk/define';
import { SectionExample } from './section-example';
import { TypographyCompositionExample } from './typography-composition-example';
import { VisuallyHiddenExample } from './visually-hidden-example';
import {
  Heading,
  Text,
  Shortcut,
  formatShortcut,
} from 'integracore-ui/primitives/typography';
import { ThemeProvider } from 'integracore-ui/theme';

import {
  ComponentGallery,
  type GalleryEntry,
} from '../shared/front-components/component-gallery';

const TYPOGRAPHY_ENTRIES: GalleryEntry[] = [
  { name: 'Typography composition', node: <TypographyCompositionExample /> },
  {
    name: 'Shortcut',
    node: (
      <>
        <Shortcut shortcut={['Mod', 'K']} platform="mac" />
        <Shortcut shortcut={[['G'], ['P']]} sequenceJoinLabel="next" />
        <Text>
          {formatShortcut({
            shortcut: ['Mod', 'K'],
            platform: 'other',
          })}
        </Text>
      </>
    ),
  },
  {
    name: 'Heading',
    node: (
      <Heading level={1} size="xxl">
        Heading 1
      </Heading>
    ),
  },
  {
    name: 'Section',
    node: <SectionExample />,
  },
  {
    name: 'HeadingLevel',
    node: (
      <Heading level={3} size="xl">
        Heading 3
      </Heading>
    ),
  },
  {
    name: 'VisuallyHidden',
    node: <VisuallyHiddenExample />,
  },
];

const TypographyGallery = () => (
  <ThemeProvider colorScheme="light">
    <ComponentGallery
      title="integracore-ui/primitives/typography + accessibility"
      entries={TYPOGRAPHY_ENTRIES}
    />
  </ThemeProvider>
);

export default defineFrontComponent({
  universalIdentifier: 'test-20ui0-0000-0000-0000-000000000104',
  name: 'integracore-ui-typography-gallery',
  description:
    'Renders every integracore-ui/primitives/typography and accessibility component in the sandbox',
  component: TypographyGallery,
});
