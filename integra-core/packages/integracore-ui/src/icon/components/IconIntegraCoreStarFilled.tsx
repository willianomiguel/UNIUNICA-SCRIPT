import IconIntegraCoreStarFilledRaw from '@assets/icons/integracore-star-filled.svg?react';
import { type IconComponentProps } from '@ui/icon/types/IconComponent';
import { useTheme } from '@ui/theme';

type IconIntegraCoreStarFilledProps = Pick<IconComponentProps, 'size' | 'stroke'>;

export const IconIntegraCoreStarFilled = (props: IconIntegraCoreStarFilledProps) => {
  const theme = useTheme();
  const size = props.size ?? 24;
  const stroke = props.stroke ?? theme.icon.stroke.md;

  return (
    <IconIntegraCoreStarFilledRaw height={size} width={size} strokeWidth={stroke} />
  );
};
