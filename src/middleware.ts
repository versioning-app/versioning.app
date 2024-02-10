import { StorageKeys } from '@/config/storage';
import { generateRequestId } from '@/lib/utils';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  beforeAuth: (req) => {
    req.headers.set(StorageKeys.REQUEST_ID_HEADER_KEY, generateRequestId());
  },
  afterAuth: async (auth, req) => {
    const { userId, orgId, sessionClaims, isPublicRoute } = auth;

    if (!userId && !isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // If the user is logged in and trying to access a protected route, allow them to access route
    if (userId && !isPublicRoute) {
      // Only ensure workspace on protected routes
      await ServiceFactory.get(WorkspaceService).ensureWorkspace({
        userId,
        orgId,
        sessionClaims,
      });

      return NextResponse.next();
    }

    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
  publicRoutes: ['/', '/pricing', '/about', '/api/billing/webhooks/stripe'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
