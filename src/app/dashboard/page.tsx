import { Navigation } from '@/config/nav';
import { auth, clerkClient, currentUser } from '@clerk/nextjs';
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
  const user = await currentUser();

  if (!user) {
    return redirect(Navigation.HOME);
  }

  const { orgId } = auth();

  const organization = await getOrganization(orgId);

  return (
    <div>
      <p>Welcome to your dashboard, {user.firstName}</p>
      {organization && <p>You are a member of {organization.name}</p>}
    </div>
  );
}
