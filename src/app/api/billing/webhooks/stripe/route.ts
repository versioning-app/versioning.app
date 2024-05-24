import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { serverLogger } from '@/lib/logger/server';
import { ServiceFactory } from '@/services/service-factory';
import { StripeService } from '@/services/stripe.service';

export async function POST(request: Request) {
  const stripeService = ServiceFactory.get(StripeService);

  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let received = false;
  try {
    received = await stripeService.handleWebhookEvent(body, signature);
  } catch (err: any) {
    if (err instanceof AppError) {
      return err.toResponse();
    }

    serverLogger({ name: 'api/billing/webhooks/stripe' }).error(
      { err },
      'Error handling webhook event',
    );

    const unknownError = new AppError(
      'Unknown error occurred while handling webhook event',
      ErrorCodes.UNHANDLED_ERROR,
    );

    return unknownError.toResponse();
  }

  return new Response(JSON.stringify({ received }));
}
