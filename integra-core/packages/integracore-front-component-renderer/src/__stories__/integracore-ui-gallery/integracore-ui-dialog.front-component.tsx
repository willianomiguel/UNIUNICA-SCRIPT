import { useState } from 'react';
import { defineFrontComponent } from 'integracore-sdk/define';
import { openCommandConfirmationModal } from 'integracore-sdk/front-component';
import { Button } from 'integracore-ui/primitives/input';
import { Text } from 'integracore-ui/primitives/typography';

import { IntegraCoreUiGalleryCard } from '@/__stories__/shared/front-components/integracore-ui-gallery-card';

const DialogExample = () => {
  const [status, setStatus] = useState('idle');

  const handleRequestConfirmation = async () => {
    setStatus('requested');
    const result = await openCommandConfirmationModal({
      title: 'Update account',
      subtitle: 'Confirm the account changes.',
      confirmButtonText: 'Update',
    });
    setStatus(result);
  };

  return (
    <IntegraCoreUiGalleryCard title="Host dialog">
      <Text>Front components request dialogs through the SDK host API.</Text>
      <Button
        onClick={handleRequestConfirmation}
        disabled={status === 'requested'}
      >
        Update account
      </Button>
      <Text role="status">Confirmation: {status}</Text>
    </IntegraCoreUiGalleryCard>
  );
};

export default defineFrontComponent({
  universalIdentifier: 'test-20ui0-0000-0000-0000-000000000111',
  name: 'integracore-ui-dialog',
  description: 'Requests a host-owned confirmation through the SDK dialog API',
  component: DialogExample,
});
