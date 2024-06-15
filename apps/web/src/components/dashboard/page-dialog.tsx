'use client';

import { Dialog } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export function PageDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog defaultOpen={true} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}
