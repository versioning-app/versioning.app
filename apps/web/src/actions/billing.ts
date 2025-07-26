'use server';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { get } from '@/services/service-factory';
import { StripeService } from '@/services/stripe.service';
import { createCheckoutSessionSchema } from '@/validation/billing';
import { redirect } from 'next/navigation';

export const createBillingPortalSession = async () => {
  const logger = await serverLogger({ name: 'createBillingPortalSession' });

  logger.debug('Creating billing portal session');

  const stripeService = await get(StripeService);
  await stripeService.createOrRetrieveCustomer();
  const { url } = await stripeService.createBillingPortalSession();

  redirect(url);
};

export const createCheckoutSession = workspaceAction
  .schema(createCheckoutSessionSchema)
  .action(async ({ parsedInput: { priceId } }) => {
    const logger = await serverLogger({ name: 'createCheckoutSession' });

    logger.debug({ priceId }, 'Creating checkout session');

    const stripeService = await get(StripeService);
    const price = await stripeService.getPriceById(priceId);
    const session = await stripeService.createCheckoutSession(price);

    if (!session || !session.url) {
      throw new AppError(
        'Stripe checkout session is not available',
        ErrorCodes.STRIPE_CHECKOUT_SESSION_STALE,
      );
    }

    redirect(session.url);
  });
