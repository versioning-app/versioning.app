// This was taken from: https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript
import 'server-only';

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2024-04-10',
  appInfo: {
    name: 'nextjs-with-stripe-typescript-demo',
    url: 'https://nextjs-with-stripe-typescript-demo.vercel.app',
  },
});
