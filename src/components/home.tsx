import { Footer, Header } from '@/components/common/home-components';
import { Logo } from '@/components/common/logo';
import { appConfig } from '@/config/app';
import { Navigation } from '@/config/nav';
import { CheckIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export function UnauthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex flex-col flex-1">{children}</main>
      <Footer />
    </>
  );
}

export function HomeComponent() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center gap-6 px-4 text-center md:px-6 lg:gap-10">
          <div className="space-y-3">
            <div>
              <Logo size={100} />
              <h1 className="text-3xl font-bold">
                Welcome to {appConfig.name}
              </h1>
            </div>
            <p className="max-w-[600px] m-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Release management made <span className="italic">easy</span>.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-gray-300"
              href={Navigation.DASHBOARD}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] mx-10">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-200 ml-3 px-3 py-1 text-sm dark:bg-gray-700">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Software releases, made easy
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  <Link
                    className="text-gray-500 hover:underline underline-offset-4 dark:text-gray-400"
                    href={appConfig.url}
                  >
                    {appConfig.name}
                  </Link>
                  &nbsp; removes the complexity in release orchestration. Manage
                  your software releases with a simple and intuitive interface.
                </p>
              </div>
            </div>
            <ul className="grid gap-2 py-4">
              <li>
                <CheckIcon className="mr-2 inline-block h-8 w-8" />
                Release version tracking
              </li>
              <li>
                <CheckIcon className="mr-2 inline-block h-8 w-8" />
                Gated release management with approvals
              </li>
              <li>
                <CheckIcon className="mr-2 inline-block h-8 w-8" />
                Powerful webhook integrations
              </li>
              <li>
                <CheckIcon className="mr-2 inline-block h-8 w-8" />
                Integrated with your favorite tools
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
