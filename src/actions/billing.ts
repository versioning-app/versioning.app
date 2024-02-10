'use server';
import { serverLogger } from '@/lib/logger/server';
import { ServiceFactory } from '@/services/service-factory';
import { StripeService } from '@/services/stripe.service';
import { redirect } from 'next/navigation';

export const createBillingPortalSession = async () => {
  const logger = serverLogger({ source: 'createBillingPortalSession' });

  logger.debug('Creating billing portal session');

  const stripeService = ServiceFactory.get(StripeService);
  await stripeService.createOrRetrieveCustomer();
  const { url } = await stripeService.createBillingPortalSession();

  redirect(url);
};
