import { LinkDisplay } from '@/ui/field/display/components/LinkDisplay';
import { type ReactNode } from 'react';
import { ListItem } from 'integracore-ui/primitives/navigation';

type LinksFieldEditPreviewProps = {
  url: string;
  label: string | null;
  saveButton: ReactNode;
};

export const LinksFieldEditPreview = ({
  url,
  label,
  saveButton,
}: LinksFieldEditPreviewProps) => (
  <ListItem actions={saveButton} actionsVisibility="always">
    <LinkDisplay value={{ url, label }} />
  </ListItem>
);
