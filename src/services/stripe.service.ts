import { Navigation } from '@/config/navigation';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { stripe } from '@/lib/stripe/stripe';
import { getURL } from '@/lib/utils';
import { BaseService } from '@/services/base.service';
import { WorkspaceService } from '@/services/workspace.service';
import { Stripe } from 'stripe';

export class StripeService extends BaseService {
  public static WEBHOOK_EVENTS = new Set([
    'product.created',
    'product.updated',
    'price.created',
    'price.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
  ]);

  public constructor(
    private readonly workspaceService: WorkspaceService = new WorkspaceService()
  ) {
    super();
  }

  public async createOrRetrieveCustomer() {
    this.logger.debug('Creating or retrieving customer');

    // Check if customer exists
    const existingCustomer = await this.retrieveCustomer();

    if (existingCustomer) {
      if (existingCustomer.deleted) {
        this.logger.warn({ existingCustomer }, 'Customer was deleted');
        throw new AppError(
          'Customer has been deleted on Stripe',
          ErrorCodes.STRIPE_CUSTOMER_DELETED
        );
      }

      // Customer has been found and is not deleted
      return existingCustomer;
    }

    // Create customer
    return await this.createCustomer();
  }

  public async retrieveCustomer() {
    const workspace = await this.workspaceService.currentWorkspace();

    if (!workspace.stripeCustomerId) {
      this.logger.warn({ workspace }, 'No stripe customer ID found');
      return null;
    }

    this.logger.debug({ workspace }, 'Retrieving customer for workspace');

    const customer = await stripe.customers.retrieve(
      workspace.stripeCustomerId
    );

    return customer;
  }

  public async createCustomer() {
    const workspace = await this.workspaceService.currentWorkspace();
    const customerDetails = await this.workspaceService.getCustomerDetails();

    this.logger.debug(
      { workspace, customerDetails },
      'Creating customer for workspace'
    );

    const { name, email } = customerDetails;

    const customer = await stripe.customers.create({
      name,
      email,
      metadata: {
        workspaceId: workspace.id,
      },
    });

    this.logger.info(
      { customer },
      'Stripe Customer created, linking to workspace'
    );

    await this.workspaceService.linkStripeCustomer(customer.id);

    return customer;
  }

  public async createBillingPortalSession() {
    const workspace = await this.workspaceService.currentWorkspace();

    if (!workspace.stripeCustomerId) {
      this.logger.warn({ workspace }, 'No stripe customer ID found');
      throw new AppError(
        'No stripe customer ID found',
        ErrorCodes.STRIPE_CUSTOMER_NOT_LINKED
      );
    }

    return stripe.billingPortal.sessions.create({
      customer: workspace.stripeCustomerId,
      return_url: `${getURL()}/${Navigation.DASHBOARD_BILLING}`,
    });
  }

  public async handleWebhookEvent(
    body: string,
    signature: string
  ): Promise<boolean> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
      if (!signature || !webhookSecret) {
        this.logger.error('Stripe Webhook signature or secret missing');

        throw new AppError(
          'Error processing stripe webhook',
          ErrorCodes.STRIPE_WEBHOOK_ERROR
        );
      }

      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

      this.logger.debug({ event }, 'Stripe Webhook event constructed');
    } catch (err: any) {
      this.logger.error({ err, body }, `Stripe Webhook Error: ${err.message}`);

      throw new AppError(
        'Error processing stripe webhook',
        ErrorCodes.STRIPE_WEBHOOK_ERROR
      );
    }

    if (StripeService.WEBHOOK_EVENTS.has(event.type)) {
      this.logger.debug({ event }, 'Processing Stripe Webhook event');

      try {
        switch (event.type) {
          case 'product.created':
          case 'product.updated':
            // await upsertProductRecord(event.data.object as Stripe.Product);
            break;
          case 'price.created':
          case 'price.updated':
            // await upsertPriceRecord(event.data.object as Stripe.Price);
            break;
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            // const subscription = event.data.object as Stripe.Subscription;
            // await manageSubscriptionStatusChange(
            //   subscription.id,
            //   subscription.customer as string,
            //   event.type === 'customer.subscription.created'
            // );
            break;
          case 'checkout.session.completed':
            // const checkoutSession = event.data.object as Stripe.Checkout.Session;
            // if (checkoutSession.mode === 'subscription') {
            //   const subscriptionId = checkoutSession.subscription;
            //   await manageSubscriptionStatusChange(
            //     subscriptionId as string,
            //     checkoutSession.customer as string,
            //     true
            //   );
            // }
            break;
          default:
            throw new AppError(
              'No webhook handler defined for stripe event',
              ErrorCodes.STRIPE_UNHANDLED_WEBHOOK_EVENT
            );
        }
      } catch (error) {
        this.logger.error({ error }, 'Stripe Webhook handler failed');

        // Handle our own errors, otherwise throw generic error
        if (error instanceof AppError) {
          throw error;
        }

        throw new AppError(
          'Error processing stripe webhook',
          ErrorCodes.STRIPE_WEBHOOK_ERROR
        );
      }
    } else {
      this.logger.warn(
        { event },
        'Received Stripe Webhook event type that is not defined in our recognized event list'
      );
    }

    return true;
  }
}
