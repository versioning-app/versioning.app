import type { Metadata } from "next";
import { Noto_Sans as FontSans } from "next/font/google";
import { cn } from "@/lib/utils"

import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"], variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "versioning.app",
  description: "Version management for your projects, made simple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>{children}</body>
    </html>
  );
}
