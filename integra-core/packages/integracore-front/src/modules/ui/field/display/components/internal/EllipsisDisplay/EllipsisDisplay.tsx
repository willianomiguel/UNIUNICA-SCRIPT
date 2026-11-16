import { css } from '@linaria/core';
import { clsx } from 'clsx';
import { Text } from 'integracore-ui/primitives/typography';
import { themeCssVariables } from 'integracore-ui/theme';
import { isDefined } from 'integracore-shared/utils';

const styles = {
  ellipsis: css`
    height: ${themeCssVariables.spacing[5]};
    line-height: ${themeCssVariables.spacing[5]};
    max-width: 100%;
    width: 100%;
  `,
};

type EllipsisDisplayProps = {
  children: React.ReactNode;
  maxWidth?: number;
  className?: string;
};

export const EllipsisDisplay = ({
  children,
  maxWidth,
  className,
}: EllipsisDisplayProps) => (
  <Text
    truncate
    className={clsx(styles.ellipsis, className)}
    style={isDefined(maxWidth) ? { maxWidth: `${maxWidth}px` } : undefined}
  >
    {children}
  </Text>
);
