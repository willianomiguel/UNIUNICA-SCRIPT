import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import type React from 'react';
import { LightIconButton } from 'integracore-ui/components/input';
import { IconChevronRight } from 'integracore-ui/icon';
import { themeCssVariables } from 'integracore-ui/theme';

const StyledChevronIcon = styled(IconChevronRight)`
  transition: transform
    calc(${themeCssVariables.animation.duration.normal} * 1s) ease;

  &[data-open] {
    transform: rotate(90deg);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

type NavigationMenuItemFolderChevronButtonProps = {
  isOpen: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const NavigationMenuItemFolderChevronButton = ({
  isOpen,
  onClick,
}: NavigationMenuItemFolderChevronButtonProps) => {
  const { t } = useLingui();

  return (
    <LightIconButton
      size="sm"
      emphasis="subtle"
      aria-label={isOpen ? t`Collapse folder` : t`Expand folder`}
      onClick={onClick}
      aria-expanded={isOpen}
    >
      <StyledChevronIcon data-open={isOpen || undefined} />
    </LightIconButton>
  );
};
