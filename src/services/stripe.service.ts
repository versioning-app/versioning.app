import { Navigation } from '@/config/navigation';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { stripe } from '@/lib/stripe/stripe';
import { getURL } from '@/lib/utils';
import { BaseService } from '@/services/base.service';
import { WorkspaceService } from '@/services/workspace.service';

export class StripeService extends BaseService {
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
}
