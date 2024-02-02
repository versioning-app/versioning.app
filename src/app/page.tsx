import { HomeComponent, UnauthenticatedLayout } from '@/components/home';

export default async function Home() {
  return (
    <UnauthenticatedLayout>
      <HomeComponent />
    </UnauthenticatedLayout>
  );
}
