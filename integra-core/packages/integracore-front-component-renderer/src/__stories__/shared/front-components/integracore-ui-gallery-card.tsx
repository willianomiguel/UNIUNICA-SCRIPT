import { type ComponentProps } from 'react';
import 'integracore-ui/style.css';
import { ThemeProvider } from 'integracore-ui/theme';

import { FrontComponentCard } from '@/__stories__/shared/front-components/front-component-card';

type IntegraCoreUiGalleryCardProps = ComponentProps<typeof FrontComponentCard>;

export const IntegraCoreUiGalleryCard = ({
  title,
  children,
}: IntegraCoreUiGalleryCardProps) => (
  <ThemeProvider colorScheme="light">
    <FrontComponentCard title={title}>{children}</FrontComponentCard>
  </ThemeProvider>
);
