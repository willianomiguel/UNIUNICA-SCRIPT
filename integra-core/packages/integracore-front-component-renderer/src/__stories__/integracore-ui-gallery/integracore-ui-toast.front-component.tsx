import { useState } from 'react';
import { defineFrontComponent } from 'integracore-sdk/define';
import { Toast } from 'integracore-ui/components/feedback';

import { IntegraCoreUiGalleryCard } from '@/__stories__/shared/front-components/integracore-ui-gallery-card';

const ToastExample = () => {
  const [closed, setClosed] = useState(false);
  const [action, setAction] = useState('none');

  return (
    <IntegraCoreUiGalleryCard title="Toast">
      {!closed && (
        <Toast
          status="success"
          progress={100}
          description="Your changes are available to the team"
          onClose={() => setClosed(true)}
          closeLabel="Dismiss notification"
          onCancel={() => setAction('cancelled')}
          action={<button onClick={() => setAction('undone')}>Undo</button>}
        >
          Account saved
        </Toast>
      )}
      <p>
        Notification: {closed ? 'closed' : 'visible'}; Action: {action}
      </p>
    </IntegraCoreUiGalleryCard>
  );
};

export default defineFrontComponent({
  universalIdentifier: '4d23e9af-7cb3-4e4a-bbca-8e960f840008',
  name: 'integracore-ui-toast',
  description: 'Toast rendering, actions and dismissal in the sandbox',
  component: ToastExample,
});
