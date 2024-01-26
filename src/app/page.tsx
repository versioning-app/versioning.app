import { auth, signIn } from '@/auth';
import { DashboardComponent } from '@/components/dashboard/dashboard';

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    signIn();
  }

  return <DashboardComponent />;
}
