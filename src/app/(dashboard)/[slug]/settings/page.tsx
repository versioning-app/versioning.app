import { ClerkOrganization, ClerkUser } from '@/components/common/clerk';
import { ChangeSlugForm } from '@/components/dashboard/workspace';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { auth } from '@clerk/nextjs';
import { Divider } from '@nextui-org/react';

export default async function Settings({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { orgId } = auth();

  return (
    <div>
      <div className="w-96">
        <p className="text-md my-2">
          Change Slug{' '}
          <span className="text-sm text-muted-foreground">
            (Currently {slug})
          </span>
        </p>
        <ChangeSlugForm />
      </div>
    </div>
  );
}
