import { cn } from '@/lib/utils';
import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import type { Metadata } from 'next';
import { Noto_Sans as FontSans } from 'next/font/google';

import { Logo } from '@/components/common/logo';
import { ThemeProvider } from '@/providers/theme-provider';
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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ClerkLoading>
              <div>
                <div className="flex items-center justify-center h-screen">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-3xl font-semibold text-center text-muted-foreground">
                      Loading your dashboard, give us a second...
                    </div>
                    <Logo className="animate-pulse h-24 w-24" />
                  </div>
                </div>
              </div>
            </ClerkLoading>
            <ClerkLoaded>{children}</ClerkLoaded>
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
