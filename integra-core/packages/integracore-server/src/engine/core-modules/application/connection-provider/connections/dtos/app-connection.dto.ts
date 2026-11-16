import { type AppConnection } from 'integracore-shared/application';

// Wire shape returned to apps from POST /apps/connections/list and /get.
// Re-exported under the `…Dto` suffix to follow the server-side naming
// convention; the canonical shape lives in integracore-shared so the SDK and
// the server stay in lock-step (changes that drift would fail typecheck).
export type AppConnectionDto = AppConnection;
