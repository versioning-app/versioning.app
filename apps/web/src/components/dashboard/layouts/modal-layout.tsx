'use client';
import { PageDialog } from '@/components/dashboard/page-dialog';
import { DialogContent } from '@/components/ui/dialog';
import { VisuallyHidden } from '@nextui-org/react';
import { DialogTitle } from '@radix-ui/react-dialog';

export function ModalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageDialog>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Modal</DialogTitle>
        </VisuallyHidden>
        {children}
      </DialogContent>
    </PageDialog>
  );
}
