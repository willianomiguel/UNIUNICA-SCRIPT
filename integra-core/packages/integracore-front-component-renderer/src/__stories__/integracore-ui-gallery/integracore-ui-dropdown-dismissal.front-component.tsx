import { useEffect, useState } from 'react';
import { defineFrontComponent } from 'integracore-sdk/define';
import { Dropdown } from 'integracore-ui/components/navigation';
import { Button } from 'integracore-ui/primitives/input';
import { Text } from 'integracore-ui/primitives/typography';

import { IntegraCoreUiGalleryCard } from '@/__stories__/shared/front-components/integracore-ui-gallery-card';

const DropdownDismissalExample = () => {
  const [selectionCount, setSelectionCount] = useState(0);
  const [outsideActionCount, setOutsideActionCount] = useState(0);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [shouldUseCustomContainer, setShouldUseCustomContainer] =
    useState(false);
  const [shouldPreventOutsideDismissal, setShouldPreventOutsideDismissal] =
    useState(false);
  const [outsidePressCount, setOutsidePressCount] = useState(0);
  const [forwardedPressCount, setForwardedPressCount] = useState(0);

  useEffect(() => {
    const countForwardedPress = (event: PointerEvent) => {
      if (event.target === document.body) {
        setForwardedPressCount((count) => count + 1);
      }
    };

    document.body.addEventListener('pointerdown', countForwardedPress);

    return () => {
      document.body.removeEventListener('pointerdown', countForwardedPress);
    };
  }, []);

  return (
    <IntegraCoreUiGalleryCard title="Dropdown dismissal">
      <Button onClick={() => setOutsideActionCount((count) => count + 1)}>
        Outside menu
      </Button>
      <Dropdown.Root
        type="menu"
        onInteractOutside={(event) => {
          setOutsidePressCount((count) => count + 1);

          if (shouldPreventOutsideDismissal) {
            event.preventDefault();
          }
        }}
      >
        <Dropdown.Trigger render={<Button>Open actions</Button>} />
        <Dropdown.Content
          aria-label="Record actions"
          container={shouldUseCustomContainer ? container : undefined}
        >
          <Dropdown.ActionItem
            onClick={() => setSelectionCount((count) => count + 1)}
          >
            Select record
          </Dropdown.ActionItem>
          <Dropdown.ActionItem closeOnClick={false}>
            Keep menu open
          </Dropdown.ActionItem>
        </Dropdown.Content>
      </Dropdown.Root>
      <div ref={setContainer} />
      <Button onClick={() => setShouldUseCustomContainer(true)}>
        Render inside widget
      </Button>
      <Button onClick={() => setShouldPreventOutsideDismissal(true)}>
        Prevent outside dismissal
      </Button>
      <Text role="status" aria-label="Selections">
        Selections: {selectionCount}
      </Text>
      <Text role="status" aria-label="Outside actions">
        Outside actions: {outsideActionCount}
      </Text>
      <Text role="status" aria-label="Outside presses">
        Outside presses: {outsidePressCount}
      </Text>
      <Text role="status" aria-label="Forwarded presses">
        Forwarded presses: {forwardedPressCount}
      </Text>
    </IntegraCoreUiGalleryCard>
  );
};

export default defineFrontComponent({
  universalIdentifier: 'fa9e77d4-87ad-47fb-b663-d92643f5c24c',
  name: 'integracore-ui-dropdown-dismissal',
  description:
    'Dropdown reopening and dismissal inside and outside the sandbox',
  component: DropdownDismissalExample,
});
