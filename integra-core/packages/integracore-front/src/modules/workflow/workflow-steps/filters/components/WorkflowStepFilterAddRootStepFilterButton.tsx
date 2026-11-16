import { useAddRootStepFilter } from '@/workflow/workflow-steps/filters/hooks/useAddRootStepFilter';
import { WorkflowStepFilterContext } from '@/workflow/workflow-steps/filters/states/context/WorkflowStepFilterContext';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useContext } from 'react';
import { IconFilter } from 'integracore-ui/icon';
import { Button } from 'integracore-ui/primitives/input';
import { themeCssVariables } from 'integracore-ui/theme';

const StyledButtonContainer = styled.div`
  margin-top: ${themeCssVariables.spacing[2]};
`;

export const WorkflowStepFilterAddRootStepFilterButton = () => {
  const { t } = useLingui();
  const { readonly } = useContext(WorkflowStepFilterContext);
  const { addRootStepFilter } = useAddRootStepFilter();

  return (
    <StyledButtonContainer>
      <Button
        startIcon={<IconFilter />}
        size="sm"
        onClick={addRootStepFilter}
        aria-label={t`Add first filter`}
        disabled={readonly}
        variant="outline"
      >{t`Add first filter`}</Button>
    </StyledButtonContainer>
  );
};
