import NextAuth from 'next-auth';

import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Email from 'next-auth/providers/email';

import { db } from '@/database/db';
import type { NextAuthConfig } from 'next-auth';

export const config = {
  theme: {
    logo: 'https://versioning.app/logo-white-transparent.png',
  },
  adapter: DrizzleAdapter(db),
  providers: [
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
