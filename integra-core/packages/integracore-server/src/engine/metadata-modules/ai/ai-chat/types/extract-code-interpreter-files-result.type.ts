import { type ExtendedUIMessage } from 'integracore-shared/ai';

import { type ExtractedFile } from 'src/engine/metadata-modules/ai/ai-chat/types/extracted-file.type';

export type ExtractCodeInterpreterFilesResult = {
  processedMessages: ExtendedUIMessage[];
  extractedFiles: ExtractedFile[];
};
