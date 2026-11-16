import {
  CalendarChannelVisibility,
  MessageChannelVisibility,
} from 'integracore-shared/types';

export type APIsOAuthState = {
  transientToken?: string;
  redirectLocation?: string;
  calendarVisibility?: CalendarChannelVisibility;
  messageVisibility?: MessageChannelVisibility;
  skipMessageChannelConfiguration?: boolean;
};
