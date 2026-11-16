import { type RecallRoutingMetadata } from 'src/logic-functions/types/recall-routing-metadata.type';

export const buildRecallRoutingMetadata = ({
  callRecordingId,
  workspaceId,
}: {
  callRecordingId: string;
  workspaceId: string;
}): RecallRoutingMetadata => ({
  integracoreWorkspaceId: workspaceId,
  integracoreCallRecordingId: callRecordingId,
});
