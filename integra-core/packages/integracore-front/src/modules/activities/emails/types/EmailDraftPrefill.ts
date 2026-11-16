import { type EmailRecipients } from 'integracore-shared/workflow';

export type EmailDraftPrefill = EmailRecipients & {
  messageId: string;
  subject: string;
  body: string;
};
