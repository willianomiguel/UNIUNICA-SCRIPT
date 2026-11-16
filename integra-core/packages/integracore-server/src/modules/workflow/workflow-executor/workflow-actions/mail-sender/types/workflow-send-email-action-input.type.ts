import { type EmailAttachment } from 'integracore-shared/types';
import { type EmailRecipients } from 'integracore-shared/workflow';

export type WorkflowSendEmailActionInput = {
  connectedAccountId: string;
  fromHandle?: string;
  recipients: EmailRecipients;
  subject?: string;
  body?: string;
  files?: EmailAttachment[];
  inReplyTo?: string;
};
