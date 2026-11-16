import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { LinksDisplay } from '@/ui/field/display/components/LinksDisplay';
import { ComponentDecorator } from 'integracore-ui/testing';

const meta: Meta<typeof LinksDisplay> = {
  title: 'UI/Display/LinksDisplay',
  component: LinksDisplay,
  decorators: [ComponentDecorator],
  argTypes: {
    value: {
      control: 'object',
      description:
        'The value object containing primaryLinkUrl, primaryLinkLabel, and secondaryLinks',
    },
  },
};

export default meta;

type Story = StoryObj<typeof LinksDisplay>;

export const NoLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: '',
      primaryLinkLabel: '',
      secondaryLinks: [],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.queryByRole('link')).toBeNull();
    });
  },
};

export const NullLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: null,
      primaryLinkLabel: 'Primary Link',
      secondaryLinks: [
        { url: null, label: 'Secondary Link' },
        { url: 'https://www.integracore.com', label: 'Valid Link' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(1);
    });

    const validLink = await canvas.findByRole('link', { name: 'Valid Link' });
    expect(validLink).toBeVisible();
    expect(validLink).toHaveAttribute('href', 'https://www.integracore.com');

    expect(canvas.queryByText('Primary Link')).not.toBeInTheDocument();
    expect(canvas.queryByText('Secondary Link')).not.toBeInTheDocument();
  },
};

export const SingleLink: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.integracore.com',
      primaryLinkLabel: 'IntegraCore Website',
      secondaryLinks: null,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = await canvas.findByRole('link');
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', 'https://www.integracore.com');
    expect(link).toHaveTextContent('IntegraCore Website');

    await waitFor(() => {
      expect(canvas.getAllByRole('link')).toHaveLength(1);
    });
  },
};

export const MultipleLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.integracore.com',
      primaryLinkLabel: 'IntegraCore Website',
      secondaryLinks: [
        { url: 'https://docs.integracore.com', label: 'Documentation' },
        { url: 'https://blog.integracore.com', label: 'Blog' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(3);
    });

    const primaryLink = await canvas.findByRole('link', {
      name: 'IntegraCore Website',
    });
    expect(primaryLink).toBeVisible();
    expect(primaryLink).toHaveAttribute('href', 'https://www.integracore.com');

    const docsLink = await canvas.findByRole('link', { name: 'Documentation' });
    expect(docsLink).toBeVisible();
    expect(docsLink).toHaveAttribute('href', 'https://docs.integracore.com');

    const blogLink = await canvas.findByRole('link', { name: 'Blog' });
    expect(blogLink).toBeVisible();
    expect(blogLink).toHaveAttribute('href', 'https://blog.integracore.com');
  },
};

export const SocialMediaLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.linkedin.com/company/integracore',
      primaryLinkLabel: '',
      secondaryLinks: [
        { url: 'https://twitter.com/integracorecrm', label: null },
        {
          url: 'https://www.instagram.com/integracore_hq',
          label: null,
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(3);
    });

    const linkedinLink = await canvas.findByRole('link', { name: 'integracore' });
    expect(linkedinLink).toBeVisible();
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/company/integracore',
    );

    const twitterLink = await canvas.findByRole('link', { name: '@integracorecrm' });
    expect(twitterLink).toBeVisible();
    expect(twitterLink).toHaveAttribute(
      'href',
      'https://twitter.com/integracorecrm',
    );

    const instagramLink = await canvas.findByRole('link', {
      name: '@integracore_hq',
    });
    expect(instagramLink).toBeVisible();
    expect(instagramLink).toHaveAttribute(
      'href',
      'https://www.instagram.com/integracore_hq',
    );
  },
};

export const InstagramLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.instagram.com/integracore_hq',
      primaryLinkLabel: '',
      secondaryLinks: [
        { url: 'https://instagram.com/p/ABC123', label: null },
        { url: 'https://instagram.com/reel/XYZ789', label: null },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(3);
    });

    const handleLink = await canvas.findByRole('link', { name: '@integracore_hq' });
    expect(handleLink).toBeVisible();
    expect(handleLink).toHaveAttribute(
      'href',
      'https://www.instagram.com/integracore_hq',
    );

    const fallbackLinks = await canvas.findAllByText('Instagram');
    expect(fallbackLinks).toHaveLength(2);
  },
};

export const SocialLinksWithCustomLabels: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.linkedin.com/company/integracore',
      primaryLinkLabel: 'IntegraCore on LinkedIn',
      secondaryLinks: [
        {
          url: 'https://www.instagram.com/integracore_hq',
          label: 'IntegraCore on Instagram',
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(2);
    });

    const linkedinLink = await canvas.findByRole('link', {
      name: 'IntegraCore on LinkedIn',
    });
    expect(linkedinLink).toBeVisible();
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/company/integracore',
    );

    const instagramLink = await canvas.findByRole('link', {
      name: 'IntegraCore on Instagram',
    });
    expect(instagramLink).toBeVisible();
    expect(instagramLink).toHaveAttribute(
      'href',
      'https://www.instagram.com/integracore_hq',
    );
  },
};

export const AutomaticLabelFromURL: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.example.com',
      primaryLinkLabel: '',
      secondaryLinks: [{ url: 'https://test.example.com', label: null }],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(2);
    });

    const primaryLink = await canvas.findByRole('link', {
      name: 'www.example.com',
    });
    expect(primaryLink).toBeVisible();
    expect(primaryLink).toHaveAttribute('href', 'https://www.example.com');

    const secondaryLink = await canvas.findByRole('link', {
      name: 'test.example.com',
    });
    expect(secondaryLink).toBeVisible();
    expect(secondaryLink).toHaveAttribute('href', 'https://test.example.com');
  },
};

export const InvalidLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: 'wikipedia',
      primaryLinkLabel: 'Invalid URL',
      secondaryLinks: [{ url: 'lydia,com', label: 'Invalid URL with comma' }],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.queryByRole('link')).toBeNull();
    });

    expect(canvas.queryByText('Invalid URL')).not.toBeInTheDocument();
    expect(
      canvas.queryByText('Invalid URL with comma'),
    ).not.toBeInTheDocument();
  },
};
