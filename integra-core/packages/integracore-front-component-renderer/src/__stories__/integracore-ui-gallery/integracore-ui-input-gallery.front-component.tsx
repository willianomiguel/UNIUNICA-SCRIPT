import { defineFrontComponent } from 'integracore-sdk/define';
import {
  IconButton,
  LightButton,
  LightIconButton,
  MainButton,
  SearchInput,
  SegmentedControl,
} from 'integracore-ui/components/input';
import { TabButton } from 'integracore-ui/components/navigation';
import { CodeEditorHeader } from 'integracore-ui/components/code-editor';
import { IconPlus, IconSearch, IconStar, IconTrash } from 'integracore-ui/icon';
import {
  Button,
  ButtonGroup,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  Switch,
} from 'integracore-ui/primitives/input';
import { ThemeProvider } from 'integracore-ui/theme';
import { Text } from 'integracore-ui/primitives/typography';
import {
  ComponentGallery,
  type GalleryEntry,
} from '../shared/front-components/component-gallery';

const INPUT_ENTRIES: GalleryEntry[] = [
  {
    name: 'Button',
    node: <Button onClick={() => {}}>{'Button'}</Button>,
  },
  {
    name: 'ButtonGroup',
    node: (
      <ButtonGroup>
        {[<Button key="a">{'A'}</Button>, <Button key="b">{'B'}</Button>]}
      </ButtonGroup>
    ),
  },
  {
    name: 'Radio (card)',
    node: (
      <RadioGroup defaultValue="card" aria-label="Card selection">
        <Radio variant="card" value="card">
          Card
        </Radio>
      </RadioGroup>
    ),
  },
  {
    name: 'Checkbox',
    node: (
      <Checkbox
        aria-label="Checkbox"
        checked={false}
        onCheckedChange={() => {}}
      />
    ),
  },
  {
    name: 'CodeEditorHeader',
    node: (
      <CodeEditorHeader
        title={<Text>Editor</Text>}
        endElement={<Button size="sm">Format</Button>}
        render={<header />}
        aria-label="Code editor"
      />
    ),
  },
  {
    name: 'IconButton (elevated)',
    node: (
      <IconButton elevated size="sm" aria-label="Search">
        <IconSearch />
      </IconButton>
    ),
  },

  {
    name: 'IconButton',
    node: (
      <IconButton aria-label="Add" onClick={() => {}}>
        <IconPlus />
      </IconButton>
    ),
  },
  {
    name: 'ButtonGroup (framed)',
    node: (
      <ButtonGroup framed attached={false} aria-label="Record actions">
        <LightIconButton size="xs" aria-label="Delete" emphasis="subtle">
          <IconTrash />
        </LightIconButton>
      </ButtonGroup>
    ),
  },
  {
    name: 'LightButton',
    node: <LightButton>{'Light'}</LightButton>,
  },
  {
    name: 'LightIconButton',
    node: (
      <LightIconButton aria-label="Star">
        <IconStar />
      </LightIconButton>
    ),
  },
  {
    name: 'MainButton',
    node: <MainButton>{'Main'}</MainButton>,
  },
  {
    name: 'Radio',
    node: (
      <RadioGroup aria-label="Radio example">
        <Radio value="radio">Radio</Radio>
      </RadioGroup>
    ),
  },
  {
    name: 'RadioGroup',
    node: (
      <RadioGroup defaultValue="a" aria-label="Letter">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>
    ),
  },
  {
    name: 'SearchInput',
    node: <SearchInput defaultValue="" placeholder="Search" />,
  },
  {
    name: 'SegmentedControl',
    node: (
      <SegmentedControl
        aria-label="Choose"
        defaultValue="left"
        options={[
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
        ]}
      />
    ),
  },
  {
    name: 'Slider',
    node: (
      <Slider.Root defaultValue={50}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb aria-label="Volume" />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    ),
  },
  {
    name: 'TabButton',
    node: <TabButton>Tab</TabButton>,
  },
  {
    name: 'Switch',
    node: (
      <Switch
        aria-label="Example switch"
        checked={false}
        onCheckedChange={() => {}}
      />
    ),
  },
];

const InputGallery = () => (
  <ThemeProvider colorScheme="light">
    <ComponentGallery
      title="integracore-ui/primitives/input + integracore-ui/components"
      entries={INPUT_ENTRIES}
    />
  </ThemeProvider>
);

export default defineFrontComponent({
  universalIdentifier: 'test-20ui0-0000-0000-0000-000000000107',
  name: 'integracore-ui-input-gallery',
  description:
    'Renders input primitives and shared button presets in the sandbox',
  component: InputGallery,
});
