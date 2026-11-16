import { RecordPickerLoadingSkeletonList } from '@/object-record/record-picker/components/RecordPickerLoadingSkeletonList';
import { RecordTableWidgetRelationPickerMenuItem } from '@/object-record/record-table-widget/components/RecordTableWidgetRelationPickerMenuItem';
import { useRecordsForSelect } from '@/object-record/select/hooks/useRecordsForSelect';
import { useState } from 'react';
import { type RecordGqlOperationFilter } from 'integracore-shared/types';
import { isNonEmptyArray } from 'integracore-shared/utils';
import { Dropdown } from 'integracore-ui/components/navigation';
import { useLingui } from '@lingui/react/macro';

type RecordTableWidgetRelationPickerDropdownContentProps = {
  objectNameSingular: string;
  recordsFilter: RecordGqlOperationFilter;
  onRelationRecordSelected: (relationRecordId: string) => void;
};

export const RecordTableWidgetRelationPickerDropdownContent = ({
  objectNameSingular,
  recordsFilter,
  onRelationRecordSelected,
}: RecordTableWidgetRelationPickerDropdownContentProps) => {
  const { t } = useLingui();
  const [searchFilter, setSearchFilter] = useState('');

  const { recordsToSelect, loading } = useRecordsForSelect({
    searchFilterText: searchFilter,
    selectedIds: [],
    objectNameSingular,
    allowRequestsToIntegraCoreIcons: true,
    filter: recordsFilter,
  });

  const hasRecords = isNonEmptyArray(recordsToSelect);

  return (
    <>
      <Dropdown.Search
        placeholder={t`Search`}
        aria-label={t`Search`}
        value={searchFilter}
        onValueChange={setSearchFilter}
      />
      <Dropdown.Separator />
      <Dropdown.Section scrollable>
        {loading && !hasRecords ? (
          <RecordPickerLoadingSkeletonList />
        ) : (
          <>
            {recordsToSelect.map((relationRecord) => (
              <RecordTableWidgetRelationPickerMenuItem
                key={relationRecord.id}
                relationRecord={relationRecord}
                onSelect={onRelationRecordSelected}
              />
            ))}
            {!hasRecords && (
              <Dropdown.Empty>{t`No records found`}</Dropdown.Empty>
            )}
          </>
        )}
      </Dropdown.Section>
    </>
  );
};
