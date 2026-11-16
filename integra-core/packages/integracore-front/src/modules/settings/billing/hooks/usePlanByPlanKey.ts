import { type BillingPlanKey } from '~/generated-metadata/graphql';
import { findOrThrow } from 'integracore-shared/utils';
import { doNotTranslate } from 'integracore-shared/i18n';
import { usePlans } from './usePlans';

export const usePlanByPlanKey = () => {
  const { listPlans } = usePlans();

  const getPlanByPlanKey = (planKey: BillingPlanKey) =>
    findOrThrow(
      listPlans(),
      (plan) => plan.planKey === planKey,
      new Error(doNotTranslate(`Plan ${planKey} not found`)),
    );

  return { getPlanByPlanKey };
};
