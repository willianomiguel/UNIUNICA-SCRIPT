import { defineFrontComponent } from 'integracore-sdk/define';

import { IntegraCoreUiGalleryCard } from '../shared/front-components/integracore-ui-gallery-card';
import { OverflowingListApiExample } from './components/OverflowingListApiExample';

const OverflowingListApi = () => (
  <IntegraCoreUiGalleryCard title="Overflowing list API">
    <OverflowingListApiExample />
  </IntegraCoreUiGalleryCard>
);

export default defineFrontComponent({
  universalIdentifier: '652141f6-6f4f-4f7b-9333-8c71b2f0b84e',
  name: 'integracore-ui-overflowing-list-api',
  description: 'Controlled popup state, native composition and caller events',
  component: OverflowingListApi,
});
