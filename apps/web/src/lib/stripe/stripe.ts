// This was taken from: https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript
import 'server-only';

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2025-06-30.basil',
  appInfo: {
    name: 'versioning.app',
    url: 'https://versioning.app',
  },
});
