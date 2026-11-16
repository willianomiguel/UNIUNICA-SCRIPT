import { type Decorator } from '@storybook/react-vite';
import { IconsProvider } from 'integracore-ui/icon/provider';

export const IconsProviderDecorator: Decorator = (Story) => {
  return (
    <IconsProvider>
      <Story />
    </IconsProvider>
  );
};
