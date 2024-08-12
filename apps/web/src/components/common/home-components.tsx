import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { UnderlinedLink } from '@/components/common/underlined-link';
import { DashboardButton } from '@/components/dashboard/dashboard-link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { appConfig } from '@/config/app';
import { Navigation } from '@/config/navigation';
import { auth } from '@clerk/nextjs/server';
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

export async function Header() {
  const { userId } = auth();

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 border-b sticky top-0 shadow-md bg-background max-w-screen">
      <Link className="mr-6 hidden lg:flex" href={Navigation.HOME}>
        <Logo />
        <span className="sr-only">{appConfig.name}</span>
      </Link>
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          <NavigationMenuLink asChild>
            {/* <Link
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              href="#"
            >
              About
            </Link> */}
          </NavigationMenuLink>
          {/* <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[400px] p-2">
                <NavigationMenuLink asChild>
                  <Link
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-white p-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Release Management
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Plan and manage your upcoming releases
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-white p-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Developer Tools
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Extend your application with our developer tools.
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-white p-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Security & Compliance
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Keep your data secure with our security features.
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-white p-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Scalability
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Scale your application with our infrastructure.
                    </div>
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem> */}
          <NavigationMenuLink asChild>
            <Link
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              href={Navigation.PRICING}
            >
              Pricing
            </Link>
          </NavigationMenuLink>
          {/* <NavigationMenuItem>
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[550px] grid-cols-2 p-2">
                <NavigationMenuLink asChild>
                  <Link
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-white p-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Blog Posts
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Read our latest blog posts.
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-white p-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Case Studies
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Read our customer case studies.
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-white p-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Documentation
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Learn how to use our product.
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-white p-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Help Center
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Get help with our product.
                    </div>
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem> */}
          <NavigationMenuLink asChild>
            <Link
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              href={appConfig.links.mailto}
            >
              Contact
            </Link>
          </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="lg:hidden" size="icon" variant="outline">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href={Navigation.HOME}>
            <Logo />
            <span>{appConfig.name}</span>
          </Link>
          <div className="grid gap-2 py-6">
            {/* <Collapsible className="grid gap-4">
              <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
                Features
                <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="-mx-6 grid gap-6 bg-gray-100 p-6 dark:bg-gray-800">
                  <Link
                    className="group grid h-auto w-full justify-start gap-1"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Analytics
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Upgrade your reporting with advanced analytics.
                    </div>
                  </Link>
                  <Link
                    className="group grid h-auto w-full justify-start gap-1"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Developer Tools
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Extend your application with our developer tools.
                    </div>
                  </Link>
                  <Link
                    className="group grid h-auto w-full justify-start gap-1"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Security & Compliance
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Keep your data secure with our security features.
                    </div>
                  </Link>
                  <Link
                    className="group grid h-auto w-full justify-start gap-1"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Scalability
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Scale your application with our infrastructure.
                    </div>
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible> */}
            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              href={Navigation.PRICING}
            >
              Pricing
            </Link>
            {/* <Collapsible className="grid gap-4">
              <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
                Resources
                <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="-mx-6 grid gap-6 bg-gray-100 p-6 dark:bg-gray-800">
                  <Link
                    className="group grid h-auto w-full justify-start gap-1"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Blog Posts
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Read our latest blog posts.
                    </div>
                  </Link>
                  <Link
                    className="group grid h-auto w-full justify-start gap-1"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Case Studies
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Read our customer case studies.
                    </div>
                  </Link>
                  <Link
                    className="group grid h-auto w-full justify-start gap-1"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Documentation
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Learn how to use our product.
                    </div>
                  </Link>
                  <Link
                    className="group grid h-auto w-full justify-start gap-1"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Help Center
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Get help with our product.
                    </div>
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible> */}
            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              href={appConfig.links.mailto}
            >
              Contact
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <div className="ml-auto flex gap-2">
        <ThemeToggle />
        <DashboardButton url={userId ? Navigation.DASHBOARD_ROOT : undefined}>
          {userId ? 'Dashboard' : 'Sign in'}
        </DashboardButton>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="w-full py-12 md:py-24 lg:py-32 ">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Contact Us
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Reach out to us with any questions or feedback.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <EnvelopeClosedIcon className="h-6 w-6" />
              <UnderlinedLink href={appConfig.links.mailto}>
                {appConfig.links.email}
              </UnderlinedLink>
            </div>
            <div className="flex items-center gap-2">
              <GitHubLogoIcon className="h-6 w-6" />
              <UnderlinedLink href={appConfig.links.github}>
                GitHub
              </UnderlinedLink>
            </div>
            <div className="flex items-center gap-2">
              <TwitterLogoIcon className="h-6 w-6" />
              <UnderlinedLink href={appConfig.links.twitter}>
                Twitter
              </UnderlinedLink>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} {appConfig.name}. All rights
              reserved.
            </p>
            <ul className="flex gap-4 mt-4">
              <li className="hover:underline">
                <Link href={Navigation.PRIVACY}>Privacy Policy</Link>
              </li>
              <li className="hover:underline">
                <Link href={Navigation.COOKIES}>Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
