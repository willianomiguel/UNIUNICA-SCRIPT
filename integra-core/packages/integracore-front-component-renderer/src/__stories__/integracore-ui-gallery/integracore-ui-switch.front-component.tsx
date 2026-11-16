import { createElement, useRef, useState } from 'react';
import { defineFrontComponent } from 'integracore-sdk/define';
import { Switch } from 'integracore-ui/primitives/input';

import { isDefined } from 'integracore-ui/utilities';

import { IntegraCoreUiGalleryCard } from '@/__stories__/shared/front-components/integracore-ui-gallery-card';

const SwitchExample = () => {
  const [checked, setChecked] = useState(false);

  const rootRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const partRef = useRef<HTMLSpanElement>(null);
  const [composition, setComposition] = useState('pending');

  return (
    <IntegraCoreUiGalleryCard title="Switch">
      <Switch.Root
        ref={rootRef}
        inputRef={inputRef}
        render={(props, state) =>
          createElement('span', {
            ...props,
            'data-active': String(state.checked),
          })
        }
        aria-label="Email notifications"
        checked={checked}
        onCheckedChange={(nextChecked, details) => {
          setChecked(nextChecked);
          setComposition(
            `${details.event.type}/${isDefined(rootRef.current) && isDefined(inputRef.current) && isDefined(partRef.current)}`,
          );
        }}
      >
        <Switch.Thumb
          ref={partRef}
          render={(props, state) =>
            createElement('span', {
              ...props,
              'data-active': String(state.checked),
            })
          }
        />
      </Switch.Root>
      <Switch aria-label="Uncontrolled notifications" defaultChecked />
      <Switch aria-label="Disabled notifications" disabled />
      <Switch aria-label="Read-only notifications" defaultChecked readOnly />
      <p role="status">
        Notifications: {checked ? 'enabled' : 'disabled'}; Composition:{' '}
        {composition}
      </p>
    </IntegraCoreUiGalleryCard>
  );
};

export default defineFrontComponent({
  universalIdentifier: '4d23e9af-7cb3-4e4a-bbca-8e960f840010',
  name: 'integracore-ui-switch',
  description:
    'Switch controlled, uncontrolled and disabled behavior in the sandbox',
  component: SwitchExample,
});
