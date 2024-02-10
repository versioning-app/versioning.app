import { serverLogger } from '@/lib/logger/server';
import { ServiceFactory } from '@/services/service-factory';
import { StripeService } from '@/services/stripe.service';

export async function POST(req: Request) {
  const logger = serverLogger({ source: 'api/billing/portal' });
  if (req.method === 'POST') {
    try {
      const stripeService = ServiceFactory.get(StripeService);

      await stripeService.createCustomer();
      const { url } = await stripeService.createBillingPortalSession();

      return new Response(JSON.stringify({ url }), {
        status: 200,
      });
    } catch (err: any) {
      logger.error({ err }, 'Error creating billing portal session');
      return new Response(
        JSON.stringify({ error: { statusCode: 500, message: err.message } }),
        {
          status: 500,
        }
      );
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405,
    });
  }
}
