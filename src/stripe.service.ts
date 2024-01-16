import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    this.stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
  }

  async createCheckoutSession(
    clientId: string,
  ): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      customer: clientId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Subscription',
              // Add other product details if necessary
            },
            unit_amount: 1000, // Price in cents, e.g., $10.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://www.tryvibe.com/success',
      cancel_url: 'https://www.tryvibe.com/cancel',
    });

    return session;
  }
}
