import { type IconComponent } from 'integracore-ui/icon';

export type OnboardingRewardAction = {
  label: string;
  Icon?: IconComponent;
  creditsReward: number;
  isRewardPerItem?: boolean;
  onClick: () => void;
};
