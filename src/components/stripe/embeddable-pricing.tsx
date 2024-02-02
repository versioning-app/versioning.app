import { auth } from '@clerk/nextjs';

export function EmbeddablePricing() {
  const { userId, orgId, orgPermissions } = auth();

  if (orgId && !orgPermissions?.includes('org:sys_profile:manage')) {
    return (
      <div className="min-h-96">
        <div className="flex items-center justify-center h-full">
          <div className="text-3xl font-semibold text-center text-muted-foreground pt-40">
            You do not have permission to manage billing
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-96">
      <stripe-pricing-table
        pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
        publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        client-
        client-reference-id={`clerk-${userId}.${orgId}`}
      />
    </div>
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
