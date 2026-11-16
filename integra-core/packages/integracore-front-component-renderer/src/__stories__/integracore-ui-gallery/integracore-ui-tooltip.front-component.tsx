import { useEffect, useState } from 'react';
import { defineFrontComponent } from 'integracore-sdk/define';
import { Button } from 'integracore-ui/primitives/input';
import { Tooltip } from 'integracore-ui/primitives/surfaces';
import { ThemeProvider } from 'integracore-ui/theme';

import { IntegraCoreUiGalleryCard } from '@/__stories__/shared/front-components/integracore-ui-gallery-card';

const TooltipExample = () => {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => Tooltip.createHandle<string>());

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <ThemeProvider colorScheme="light" applyToRoot={false}>
      <IntegraCoreUiGalleryCard title="Tooltip">
        <Tooltip
          content="Download visible records as a CSV file"
          open={open}
          onOpenChange={setOpen}
          delay={0}
        >
          <span>
            <Button>Export records</Button>
          </span>
        </Tooltip>
        <Tooltip.Root>
          <Tooltip.Trigger render={<span />} delay={0}>
            <Button>Export details</Button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner sideOffset={10}>
              <Tooltip.Popup>
                <Tooltip.Arrow />
                <Tooltip.Viewport>
                  <Tooltip.Body description="Your current filters are applied.">
                    Export visible records
                  </Tooltip.Body>
                </Tooltip.Viewport>
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Trigger
          handle={handle}
          payload="Detached export help"
          render={<Button>Detached export</Button>}
        />
        <Tooltip<string>
          handle={handle}
          content={({ payload }) => payload}
          triggerProps={{ payload: 'Local export help' }}
        >
          <Button>Local export</Button>
        </Tooltip>
        <p role="status" aria-busy={!ready}>
          Export help: {open ? 'open' : 'closed'}
        </p>
      </IntegraCoreUiGalleryCard>
    </ThemeProvider>
  );
};

export default defineFrontComponent({
  universalIdentifier: '535b0395-1e6c-435d-b2ae-94203be51c42',
  name: 'integracore-ui-tooltip',
  description: 'Tooltip hover, composed content and dismissal in the sandbox',
  component: TooltipExample,
});
