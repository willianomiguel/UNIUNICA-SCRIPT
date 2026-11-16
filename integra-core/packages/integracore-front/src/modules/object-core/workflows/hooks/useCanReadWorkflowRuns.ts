import { StandardObjectNameSingular } from 'integracore-shared/types';
import { canReachSomeRecords } from 'integracore-shared/utils';

import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useObjectPermissionsForObject } from '@/object-record/hooks/useObjectPermissionsForObject';

export const useCanReadWorkflowRuns = () => {
  const { objectMetadataItem: workflowRunObjectMetadataItem } =
    useObjectMetadataItem({
      objectNameSingular: StandardObjectNameSingular.WorkflowRun,
    });
  const workflowRunPermissions = useObjectPermissionsForObject(
    workflowRunObjectMetadataItem.id,
  );

  return canReachSomeRecords({
    objectRecordsPermissions: workflowRunPermissions,
    operationType: 'read',
  });
};
