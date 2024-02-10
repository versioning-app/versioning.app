'use client';
import { createBillingPortalSession } from '@/actions/billing';
import { Button } from '@/components/ui/button';

export function BillingManagement() {
  return (
    <div>
      <h1>Billing Management</h1>

      <Button onClick={async () => await createBillingPortalSession()}>
        Open portal
      </Button>
    </div>
  );
}
