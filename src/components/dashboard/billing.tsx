'use client';
import { createBillingPortalSession, createCheckoutSession } from '@/actions/billing';
import { Button } from '@/components/ui/button';
import { formatAmountForDisplay } from '@/lib/stripe/stripe-helpers';
import { useState } from 'react';
import Stripe from 'stripe';


export function BillingManagement({ prices }: { prices: Stripe.Price[]}) {
  const [interval, setInterval] = useState<Stripe.Price.Recurring.Interval>('year');
  const products = prices.map((price) => price.product as Stripe.Product); 

  const getProductPrices = (product: Stripe.Product) => prices.filter((price) => price.product === product && price.recurring?.interval === interval)?.[0] ;

  return (
    <div>
      <h1>Billing Management</h1>

      <Button onClick={async () =>  createBillingPortalSession()}>
        Open portal
      </Button>

      <li>
        {products.map((product) => (
          <BillingProduct key={product.id} product={product} price={getProductPrices(product)} period={interval} />
        ))}
      </li>
      <Button onClick={() => setInterval(interval === 'year' ? 'month' : 'year')}>
        Show {interval === 'year' ? 'monthly' : 'yearly'}
        </Button>
    </div>
  );
}

export function BillingProduct({ product, price, period }: { product: Stripe.Product, price: Stripe.Price, period: Stripe.Price.Recurring.Interval }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {price && (
        <div>
          <h2>{price.nickname}</h2>
          
          <p>{formatAmountForDisplay(price.unit_amount as number, price.currency)} / {period}</p>
          <Button onClick={async () => createCheckoutSession({ priceId: price.id })}>
            Subscribe
          </Button>
          </div>
      )}
    </div>
  );
}
