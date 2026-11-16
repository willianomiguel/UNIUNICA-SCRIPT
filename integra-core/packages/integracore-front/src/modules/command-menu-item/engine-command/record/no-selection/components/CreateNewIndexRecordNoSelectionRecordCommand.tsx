import { HeadlessEngineCommandWrapperEffect } from '@/command-menu-item/engine-command/components/HeadlessEngineCommandWrapperEffect';
import { useHeadlessCommandContextApi } from '@/command-menu-item/engine-command/hooks/useHeadlessCommandContextApi';
import { getToastOptionsFromError } from '@/error-handler/utils/getToastOptionsFromError';
import { useCreateNewIndexRecord } from '@/object-record/record-table/hooks/useCreateNewIndexRecord';
import { isDefined } from 'integracore-shared/utils';
import { doNotTranslate } from 'integracore-shared/i18n';
import { useToast } from 'integracore-ui/components/feedback';

export const CreateNewIndexRecordNoSelectionRecordCommand = () => {
  const { objectMetadataItem, recordIndexId } = useHeadlessCommandContextApi();

  const { enqueueToast } = useToast();

  if (!isDefined(objectMetadataItem) || !isDefined(recordIndexId)) {
    throw new Error(
      doNotTranslate(
        'Object metadata item and record index ID are required to create new index record',
      ),
    );
  }

  const { createNewIndexRecord } = useCreateNewIndexRecord({
    objectMetadataItem,
    instanceId: recordIndexId,
  });

  return (
    <HeadlessEngineCommandWrapperEffect
      execute={() =>
        void createNewIndexRecord({ position: 'first' }).catch((error) =>
          enqueueToast(getToastOptionsFromError({ error })),
        )
      }
    />
  );
};
