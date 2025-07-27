import { BillingManagement } from '@/components/dashboard/billing';
import { get } from '@/services/service-factory';
import { StripeService } from '@/services/stripe.service';

export default async function Billing() {
  const stripeService = await get(StripeService);
  const prices = await stripeService.getAllPrices();
  return (
    <div>
      <h1>Billing</h1>

      <BillingManagement prices={prices} />
      {/* <BillingCheckout products={products} /> */}
    </div>
  );
}
