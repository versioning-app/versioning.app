import { StorageKeys } from '@/config/storage';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  beforeAuth: (req) => {
    req.headers.set(StorageKeys.CORRELATION_ID_HEADER_KEY, crypto.randomUUID());
  },
  afterAuth: async (auth, req, event) => {
    if (auth.userId) {
      const workspace = await ServiceFactory.get(
        WorkspaceService
      ).currentWorkspace({
        userId: auth.userId,
        orgId: auth.orgId ?? undefined,
      });

      await ServiceFactory.get(WorkspaceService).linkWorkspaceToClerk({
        workspaceId: workspace.id,
        userId: auth.userId,
        orgId: auth.orgId ?? undefined,
      });
    }

    // Redirect logged in users to organization selection page if they are not active in an organization
    // if (
    //   auth.userId &&
    //   !auth.orgId &&
    //   req.nextUrl.pathname !== "/org-selection"
    // ) {
    //   const orgSelection = new URL("/org-selection", req.url);
    //   return NextResponse.redirect(orgSelection);
    // }

    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // If the user is logged in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next();
    }

    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
  // afterAuth: async (auth, req, event) => {
  //   const logger = serverLogger({ source: 'middleware/afterAuth' });

  //   // Always clear workspace cookie
  //   req.cookies.delete(StorageKeys.WORKSPACE_COOKIE_KEY);

  //   if (auth.isPublicRoute) {
  //     logger.debug('Allowing access to public route');
  //     return NextResponse.next();
  //   }

  //   if (!auth.userId) {
  //     logger.debug('No user, redirecting to sign in');
  //     return redirectToSignIn({ returnBackUrl: req.url });
  //   }

  //   const workspace = await ServiceFactory.get(
  //     WorkspaceService
  //   ).currentWorkspace({
  //     userId: auth.userId,
  //     orgId: auth.orgId ?? undefined,
  //   });

  //   // Handle edge case when there is no workspace - should never occur
  //   if (!workspace) {
  //     logger.error(
  //       'No workspace found for authentication session, investigate'
  //     );
  //     return redirectToSignIn({ returnBackUrl: req.url });
  //   }

  //   logger.debug({ workspace }, 'Setting Workspace cookie');
  //   req.cookies.set({
  //     name: StorageKeys.WORKSPACE_COOKIE_KEY,
  //     value: JSON.stringify(workspace),
  //   });

  //   // Allow users to access route
  //   return NextResponse.next();
  // },
  publicRoutes: ['/', '/pricing', '/about'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
