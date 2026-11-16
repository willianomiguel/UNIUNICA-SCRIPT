import { defineFrontComponent } from 'integracore-sdk/define';
import { ListItem } from 'integracore-ui/primitives/navigation';
import { ThemeProvider } from 'integracore-ui/theme';

import { IntegraCoreUiGalleryCard } from '@/__stories__/shared/front-components/integracore-ui-gallery-card';
import { ListItemButtonExample } from '@/__stories__/integracore-ui-gallery/list-item-button-example';
import { ListItemOwnerExample } from '@/__stories__/integracore-ui-gallery/list-item-owner-example';
import { ListItemPopupOwnerExample } from '@/__stories__/integracore-ui-gallery/list-item-popup-owner-example';
import { ListItemPresentationExample } from '@/__stories__/integracore-ui-gallery/list-item-presentation-example';

const OVERFLOW_ROW_STYLE = { width: 160 };

const ListItemExample = () => (
  <IntegraCoreUiGalleryCard title="ListItem">
    <ListItemButtonExample />
    <ListItemOwnerExample />
    <ListItemPresentationExample />
    <ListItemPopupOwnerExample />
    <ThemeProvider colorScheme="light" applyToRoot={false}>
      <ListItem style={OVERFLOW_ROW_STYLE}>
        A long workspace preference that overflows its row
      </ListItem>
    </ThemeProvider>
  </IntegraCoreUiGalleryCard>
);

export default defineFrontComponent({
  universalIdentifier: '4d23e9af-7cb3-4e4a-bbca-8e960f840003',
  name: 'integracore-ui-list-item',
  description:
    'ListItemButton actions and ListItem rows with explicit native owners',
  component: ListItemExample,
});
