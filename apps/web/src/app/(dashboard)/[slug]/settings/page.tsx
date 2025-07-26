import { ChangeSlugForm } from '@/components/dashboard/workspace';
import { auth } from '@clerk/nextjs/server';

export default async function Settings({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
