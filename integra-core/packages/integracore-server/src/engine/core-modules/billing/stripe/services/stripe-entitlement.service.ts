/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';

import type Stripe from 'stripe';

import { isDefined } from 'integracore-shared/utils';

import {
  BillingException,
  BillingExceptionCode,
} from 'src/engine/core-modules/billing/billing.exception';
import { StripeSDKService } from 'src/engine/core-modules/billing/stripe/stripe-sdk/services/stripe-sdk.service';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

@Injectable()
export class StripeEntitlementService {
  protected readonly logger = new Logger(StripeEntitlementService.name);
  private readonly stripe?: Stripe;

  constructor(
    private readonly integracoreConfigService: IntegraCoreConfigService,
    private readonly stripeSDKService: StripeSDKService,
  ) {
    if (!this.integracoreConfigService.get('IS_BILLING_ENABLED')) {
      return;
    }
    this.stripe = this.stripeSDKService.getStripe(
      this.integracoreConfigService.get('BILLING_STRIPE_API_KEY'),
    );
  }

  async getActiveEntitlementLookupKeys(
    stripeCustomerId: string,
  ): Promise<string[]> {
    if (!isDefined(this.stripe)) {
      throw new BillingException(
        'Cannot read Stripe entitlements while billing is disabled',
        BillingExceptionCode.BILLING_STRIPE_ERROR,
      );
    }

    const lookupKeys: string[] = [];

    for await (const activeEntitlement of this.stripe.entitlements.activeEntitlements.list(
      { customer: stripeCustomerId, limit: 100 },
    )) {
      lookupKeys.push(activeEntitlement.lookup_key);
    }

    return lookupKeys;
  }
}
