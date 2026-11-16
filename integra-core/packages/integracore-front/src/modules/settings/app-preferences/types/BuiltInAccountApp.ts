import { type BuiltInAccountAppPermission } from '@/settings/app-preferences/types/BuiltInAccountAppPermission';
import { type MessageDescriptor } from '@lingui/core';
import { type ConnectedAccountProvider } from 'integracore-shared/types';
import { type IconComponent } from 'integracore-ui/icon';

export type BuiltInAccountApp = {
  id: 'google' | 'outlook' | 'imap';
  name: MessageDescriptor;
  description: MessageDescriptor;
  connectTitle: MessageDescriptor;
  logo: string;
  coverImage: string;
  Icon: IconComponent;
  provider: ConnectedAccountProvider;
  hasEmails: boolean;
  hasCalendar: boolean;
  permissions: BuiltInAccountAppPermission[];
};
