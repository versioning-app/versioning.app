import { getEntity } from '@/actions/entity';
import { Navigation } from '@/config/nav';
import { auth, clerkClient } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const getOrganization = async (organizationId: string | null | undefined) => {
  if (!organizationId) {
    return undefined;
  }

  return await clerkClient.organizations.getOrganization({
    organizationId,
  });
};

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect(Navigation.HOME);
  }

  const entity = await getEntity();

  return (
    <div>
      <p>Welcome to your dashboard</p>
      {/* {organization && <p>You are a member of {organization.name}</p>} */}
      {entity && <pre>{JSON.stringify(entity, null, 2)}</pre>}
    </div>
  );
}
