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
      const { workspaceId } = await ServiceFactory.get(
        WorkspaceService
      ).ensureWorkspace({
        userId,
        orgId,
        sessionClaims,
      });

      if (
        req.cookies.get(StorageKeys.WORKSPACE_COOKIE_KEY)?.value !== workspaceId
      ) {
        req.cookies.set(StorageKeys.WORKSPACE_COOKIE_KEY, workspaceId);
      }

      return NextResponse.next();
    }

    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
  publicRoutes: ['/', '/pricing', '/about'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
