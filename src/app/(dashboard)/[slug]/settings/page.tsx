import { ClerkOrganization, ClerkUser } from '@/components/common/clerk';
import { ChangeSlugForm } from '@/components/dashboard/workspace';
import { auth } from '@clerk/nextjs';

export default async function Settings() {
  const { orgId } = auth();
  return (
    <div>
      <h1>Settings</h1>
      <div>
        <h2>Organization Switcher</h2>
        <ClerkOrganization />
      </div>
      <div>
        <h2>User Profile</h2>
        <ClerkUser />
      </div>
      <div>
        <h2>Change Slug</h2>
        <p>Change the slug for your {orgId ? 'organization' : 'user'}</p>
        <ChangeSlugForm />
      </div>
    </div>
  );
}
