import { type Preview } from '@storybook/react-vite';
import { ThemeProvider } from 'integracore-ui/theme';

import 'integracore-ui/theme-light.css';
import 'integracore-ui/theme-dark.css';

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      return (
        <ThemeProvider colorScheme="light">
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
