'use client'; // Error components must be Client Components

import { Button } from '@/components/ui/button';
import { Navigation } from '@/config/navigation';
import { AppError } from '@/lib/error/app.error';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <h1 className="text-2xl">Oops, that's not supposed to happen!</h1>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <p>An error occurred</p>
        <p>If the problem persists, please contact support</p>

        <Link href={Navigation.DASHBOARD_ROOT}>
          <Button className="mt-2">Reload dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
