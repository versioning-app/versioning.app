import { Storage } from '@/config/storage';
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  beforeAuth: (req) => {
    req.headers.set(Storage.CORRELATION_ID_HEADER_KEY, crypto.randomUUID());
  },
  publicRoutes: ['/', '/pricing', '/about'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
