/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';

import type Stripe from 'stripe';

import { StripeSDKService } from 'src/engine/core-modules/billing/stripe/stripe-sdk/services/stripe-sdk.service';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

@Injectable()
export class StripeProductService {
  protected readonly logger = new Logger(StripeProductService.name);
  private readonly stripe: Stripe;

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

  // Includes archived: only the sync repairs an active flag left stale by a missed product.updated webhook
  async getAllProducts() {
    const products: Stripe.Product[] = [];

    for await (const product of this.stripe.products.list({ limit: 100 })) {
      products.push(product);
    }

    return products;
  }
}
