import { useState } from 'react';
import { defineFrontComponent } from 'integracore-sdk/define';
import { Slider } from 'integracore-ui/primitives/input';
import { Text } from 'integracore-ui/primitives/typography';

import { IntegraCoreUiGalleryCard } from '@/__stories__/shared/front-components/integracore-ui-gallery-card';

const SliderRangeExample = () => {
  const [value, setValue] = useState<readonly number[]>([20, 80]);
  const [committedValue, setCommittedValue] = useState<readonly number[]>([
    20, 80,
  ]);

  return (
    <IntegraCoreUiGalleryCard title="Slider range">
      <Slider.Root
        value={value}
        onValueChange={setValue}
        onValueCommitted={setCommittedValue}
      >
        <Slider.Label>Price range</Slider.Label>
        <Slider.Value />
        <Slider.Control data-testid="range-control">
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb index={0} aria-label="Minimum price" />
            <Slider.Thumb index={1} aria-label="Maximum price" />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
      <Text>
        Range: {value.join(', ')}; Committed range: {committedValue.join(', ')}
      </Text>
    </IntegraCoreUiGalleryCard>
  );
};

export default defineFrontComponent({
  universalIdentifier: '4d23e9af-7cb3-4e4a-bbca-8e960f840013',
  name: 'integracore-ui-slider-range',
  description: 'Slider range thumb registration in the sandbox',
  component: SliderRangeExample,
});
