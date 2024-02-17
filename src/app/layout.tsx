import { cn } from '@/lib/utils';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import type { Metadata } from 'next';
import { Noto_Sans as FontSans } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { appConfig } from '@/config/app';
import { AppProviders } from '@/providers/providers';
import Script from 'next/script';
import '../styles/globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'versioning.app',
  description: 'Version management for your projects, made simple.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider supportEmail={appConfig.links.email}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased min-w-[500px]',
            fontSans.variable
          )}
        >
          <AppProviders attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster closeButton={true} richColors={true} duration={6000} />
            <SpeedInsights />
            <Analytics />
          </AppProviders>
        </body>
        <Script src="https://js.stripe.com/v3/pricing-table.js" async={true} />
      </html>
    </ClerkProvider>
  );
}
