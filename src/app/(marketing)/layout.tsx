import { Footer, Header } from '@/components/common/home-components';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex flex-col flex-1">{children}</main>
      <Footer />
    </>
  );
}
