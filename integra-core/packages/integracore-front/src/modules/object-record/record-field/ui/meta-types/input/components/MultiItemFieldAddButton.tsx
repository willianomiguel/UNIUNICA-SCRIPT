import { styled } from '@linaria/react';
import { ListItemButton } from 'integracore-ui/components/navigation';
import { IconPlus } from 'integracore-ui/icon';
import { OverflowingTextWithTooltip } from 'integracore-ui/primitives/typography';
import { themeCssVariables } from 'integracore-ui/theme';

const StyledAddItemContainer = styled.div`
  padding: ${themeCssVariables.spacing[1]};
`;

type MultiItemFieldAddButtonProps = {
  label: string;
  onClick: () => void;
};

export const MultiItemFieldAddButton = ({
  label,
  onClick,
}: MultiItemFieldAddButtonProps) => (
  <StyledAddItemContainer>
    <ListItemButton onClick={onClick} startIcon={<IconPlus />}>
      <OverflowingTextWithTooltip text={label} />
    </ListItemButton>
  </StyledAddItemContainer>
);
