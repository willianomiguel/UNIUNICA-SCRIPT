import { type TimelineActivityTypeSnapshot } from 'integracore-shared/timeline';

export type TimelineActivityType = TimelineActivityTypeSnapshot & {
  isActive?: boolean;
};
