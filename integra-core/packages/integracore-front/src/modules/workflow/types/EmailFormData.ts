import {
  type EmailRecipients,
  type WorkflowEmailFiles,
} from 'integracore-shared/workflow';

export type EmailFormData = {
  connectedAccountId: string;
  fromHandle: string;
  recipients: Required<EmailRecipients>;
  subject: string;
  body: string;
  files: WorkflowEmailFiles;
  inReplyTo: string;
};
