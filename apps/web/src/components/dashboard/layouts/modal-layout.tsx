import { PageDialog } from '@/components/dashboard/page-dialog';
import { DialogContent } from '@/components/ui/dialog';

export function ModalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageDialog>
      <DialogContent>{children}</DialogContent>
    </PageDialog>
  );
}
