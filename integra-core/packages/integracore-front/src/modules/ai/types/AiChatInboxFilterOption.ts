import { type IconComponent } from 'integracore-ui/icon';

export type AiChatInboxFilterOption = {
  key: string;
  label: string;
  Icon: IconComponent;
  count?: number;
  isSelected: boolean;
  onSelect: () => void;
};
