import { defineFrontComponent } from 'integracore-sdk/define';

import { IntegraCoreUiGalleryCard } from '@/__stories__/shared/front-components/integracore-ui-gallery-card';
import { TabButtonContractsExample } from '@/__stories__/integracore-ui-gallery/tab-button-contracts-example';
import { TabsContractsExample } from '@/__stories__/integracore-ui-gallery/tabs-contracts-example';

const TabsExample = () => (
  <IntegraCoreUiGalleryCard title="Tabs">
    <TabsContractsExample />
    <TabButtonContractsExample />
  </IntegraCoreUiGalleryCard>
);

export default defineFrontComponent({
  universalIdentifier: '4d23e9af-7cb3-4e4a-bbca-8e960f840004',
  name: 'integracore-ui-tabs',
  description: 'Tabs panels, keyboard selection, and route or action controls',
  component: TabsExample,
});
