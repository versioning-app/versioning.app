import { ClerkOrganization, ClerkUser } from '@/components/common/clerk';
import { unstable_noStore as noStore } from 'next/cache';

export default async function Settings() {
  noStore();
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
    </div>
  );
}
