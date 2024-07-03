'use client';

import { Dialog } from '@/components/ui/dialog';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export function PageDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [initialPath, setInitialPath] = useState<string>();
  const pathname = usePathname();

  if (!initialPath) {
    setInitialPath(pathname);
  }

  /**
   * HACK: Not sure why, but on modal create routes there is a bug
   * after create/nav it does not close modal, so we will just render null
   * if the pathname changes, to avoid it...
   */
  if (initialPath !== pathname) {
    return null;
  }

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
