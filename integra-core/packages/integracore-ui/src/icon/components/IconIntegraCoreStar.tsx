import IconIntegraCoreStarRaw from '@assets/icons/integracore-star.svg?react';
import { type IconComponentProps } from '@ui/icon/types/IconComponent';
import { useTheme } from '@ui/theme';

type IconIntegraCoreStarProps = Pick<IconComponentProps, 'size' | 'stroke'>;

export const IconIntegraCoreStar = (props: IconIntegraCoreStarProps) => {
  const theme = useTheme();
  const size = props.size ?? 24;
  const stroke = props.stroke ?? theme.icon.stroke.md;

  return <IconIntegraCoreStarRaw height={size} width={size} strokeWidth={stroke} />;
};
