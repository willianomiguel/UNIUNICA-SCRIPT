import { type Decorator } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from 'integracore-ui/primitives/input';
import { Text } from 'integracore-ui/primitives/typography';

export const SelectPageDecorator: Decorator = (Story) => {
  const [hostActionCount, setHostActionCount] = useState(0);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Button onClick={() => setHostActionCount(hostActionCount + 1)}>
        Host action
      </Button>
      <Text role="status" aria-label="Host actions">
        Host actions: {hostActionCount}
      </Text>
      <div
        style={{
          position: 'absolute',
          left: 220,
          top: 48,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        <Story />
      </div>
    </div>
  );
};
