/* @license Enterprise */

import { Injectable } from '@nestjs/common';

import { isDefined } from 'integracore-shared/utils';

import { NO_BILLING_SUBSCRIPTION } from 'src/engine/core-modules/billing/constants/no-billing-subscription.constant';
import { SubscriptionStatus } from 'src/engine/core-modules/billing/enums/billing-subscription-status.enum';
import { UserCreditsFallback } from 'src/engine/core-modules/billing/enums/billing-user-credits-fallback.enum';
import { type FlatBillingSubscription } from 'src/engine/core-modules/billing/types/flat-billing-subscription.type';
import { computePlanAllowanceMicro } from 'src/engine/core-modules/billing/utils/compute-plan-allowance-micro.util';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';
import { type CreditAllowance } from 'src/engine/core-modules/usage-limit/types/credit-allowance.type';
import { type UsagePeriod } from 'src/engine/core-modules/usage-limit/types/usage-period.type';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';

@Injectable()
export class BillingCreditAllowanceService {
  constructor(
    private readonly integracoreConfigService: IntegraCoreConfigService,
    private readonly workspaceCacheService: WorkspaceCacheService,
  ) {}

  async isCreditAllowanceEnabled(): Promise<boolean> {
    return this.integracoreConfigService.get('IS_BILLING_ENABLED');
  }

  async getCreditAllowancePeriod(
    workspaceId: string,
  ): Promise<UsagePeriod | null> {
    const subscription = await this.findCurrentBillingSubscription(workspaceId);

    if (!isDefined(subscription)) {
      return null;
    }

    return {
      periodStart: new Date(subscription.currentPeriodStart),
      periodEnd: new Date(subscription.currentPeriodEnd),
    };
  }

  async getCreditAllowance(
    workspaceId: string,
  ): Promise<CreditAllowance | null> {
    const subscription = await this.findCurrentBillingSubscription(workspaceId);

    if (!isDefined(subscription)) {
      return null;
    }

    const planAllowanceMicro = computePlanAllowanceMicro({
      ...subscription,
      nowMs: Date.now(),
    });

    if (!isDefined(planAllowanceMicro)) {
      return null;
    }

    return {
      periodStart: new Date(subscription.currentPeriodStart),
      periodEnd: new Date(subscription.currentPeriodEnd),
      planAllowanceMicro,
      grants: subscription.creditGrants,
    };
  }

  async getSubscriptionPlan(
    workspaceId: string,
  ): Promise<{ planKey: string | null; isTrialing: boolean } | null> {
    const subscription = await this.findCurrentBillingSubscription(workspaceId);

    if (!isDefined(subscription)) {
      return null;
    }

    return {
      planKey: subscription.planKey,
      isTrialing: subscription.status === SubscriptionStatus.Trialing,
    };
  }

  async getUserCreditsFallback(
    workspaceId: string,
  ): Promise<UserCreditsFallback> {
    const subscription = await this.findCurrentBillingSubscription(workspaceId);

    return (
      subscription?.userCreditsFallback ?? UserCreditsFallback.WORKSPACE_CREDITS
    );
  }

  private async findCurrentBillingSubscription(
    workspaceId: string,
  ): Promise<FlatBillingSubscription | null> {
    if (!this.integracoreConfigService.get('IS_BILLING_ENABLED')) {
      return null;
    }

    const { currentBillingSubscription } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'currentBillingSubscription',
      ]);

    return currentBillingSubscription === NO_BILLING_SUBSCRIPTION
      ? null
      : currentBillingSubscription;
  }
}
