import { styled } from '@linaria/react';
import { RadioGroup } from 'integracore-ui/primitives/input';
import { SettingsRadioCard } from '@/settings/components/SettingsRadioCard';
import { type IconComponent } from 'integracore-ui/icon';
import { themeCssVariables } from 'integracore-ui/theme';

const StyledRadioCardContainer = styled.div`
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[4]};
`;

type SettingsRadioCardContainerProps = {
  onChange: (value: string) => void;
  value: string;
  options: Array<{
    value: string;
    title: string;
    description?: string;
    Icon?: IconComponent;
  }>;
};

export const SettingsRadioCardContainer = ({
  options,
  value,
  onChange,
}: SettingsRadioCardContainerProps) => {
  return (
    <RadioGroup
      orientation="horizontal"
      value={value}
      onValueChange={onChange}
      render={<StyledRadioCardContainer />}
    >
      {options.map((option) => (
        <SettingsRadioCard
          key={option.value}
          value={option.value}
          title={option.title}
          description={option.description}
          Icon={option.Icon}
        />
      ))}
    </RadioGroup>
  );
};
