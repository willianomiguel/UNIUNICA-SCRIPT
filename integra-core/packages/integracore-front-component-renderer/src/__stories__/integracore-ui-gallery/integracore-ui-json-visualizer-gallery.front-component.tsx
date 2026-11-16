import { useState } from 'react';
import { Button } from 'integracore-ui/primitives/input';
import { defineFrontComponent } from 'integracore-sdk/define';
import { JsonTree } from 'integracore-ui/components/data-display';
import 'integracore-ui/style.css';
import { ThemeProvider } from 'integracore-ui/theme';

import {
  ComponentGallery,
  type GalleryEntry,
} from '../shared/front-components/component-gallery';

const JSON_VISUALIZER_ENTRIES: GalleryEntry[] = [
  {
    name: 'JsonTree',
    node: (
      <JsonTree
        value={{ id: 1, name: 'IntegraCore', tags: ['a', 'b'], active: true }}
        shouldExpandNodeInitially={() => true}
        emptyArrayLabel="[empty array]"
        emptyObjectLabel="[empty object]"
        emptyStringLabel="[empty string]"
        arrowButtonCollapsedLabel="Expand"
        arrowButtonExpandedLabel="Collapse"
      />
    ),
  },
];

const JsonVisualizerGallery = () => {
  const [activations, setActivations] = useState(0);
  const [parentClicks, setParentClicks] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  const [lastValue, setLastValue] = useState('');
  const onNodeValueClick = (value: string) => {
    setActivations((count) => count + 1);
    setLastValue(value);
  };

  return (
    <ThemeProvider colorScheme="light">
      <ComponentGallery
        title="integracore-ui/components: JsonTree"
        entries={JSON_VISUALIZER_ENTRIES}
      />
      <Button>Before values</Button>
      <form
        onClick={() => setParentClicks((count) => count + 1)}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((count) => count + 1);
        }}
      >
        <JsonTree
          value="Copy this value"
          emptyArrayLabel="[empty array]"
          emptyObjectLabel="[empty object]"
          emptyStringLabel="[empty string]"
          arrowButtonCollapsedLabel="Expand"
          arrowButtonExpandedLabel="Collapse"
          onNodeValueClick={onNodeValueClick}
        />
        <fieldset disabled>
          <legend>Unavailable values</legend>
          <JsonTree
            value="Disabled value"
            emptyArrayLabel="[empty array]"
            emptyObjectLabel="[empty object]"
            emptyStringLabel="[empty string]"
            arrowButtonCollapsedLabel="Expand"
            arrowButtonExpandedLabel="Collapse"
            onNodeValueClick={onNodeValueClick}
          />
        </fieldset>
      </form>
      <Button>After values</Button>
      <output aria-label="Value activations">{activations}</output>
      <output aria-label="Parent clicks">{parentClicks}</output>
      <output aria-label="Form submissions">{submissions}</output>
      <output aria-label="Last value">{lastValue}</output>
    </ThemeProvider>
  );
};

export default defineFrontComponent({
  universalIdentifier: 'test-20ui0-0000-0000-0000-000000000106',
  name: 'integracore-ui-json-visualizer-gallery',
  description: 'Renders JsonTree in the sandbox',
  component: JsonVisualizerGallery,
});
