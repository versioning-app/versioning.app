import { UnauthenticatedLayout } from '@/components/home';

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UnauthenticatedLayout>{children}</UnauthenticatedLayout>;
}
