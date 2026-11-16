import { type IngestMessageAttachment } from 'integracore-sdk/logic-function';

export type LinkedinMessageAttachments = {
  messageExternalId: string;
  attachments: IngestMessageAttachment[];
};
