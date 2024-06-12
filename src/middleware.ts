import { StorageKeys } from '@/config/storage';
import { generateRequestId } from '@/lib/utils';
import { apiMiddleware } from '@/middleware/api';
import { get } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/home',
  '/pricing',
  '/about',
  '/api/billing/webhooks/stripe',
]);

const isApiRoute = createRouteMatcher(['/api/v1/(.*)']);

export default clerkMiddleware(async (auth, req, event) => {
  // Generate request ID for each request
  req.headers.set(StorageKeys.REQUEST_ID_HEADER_KEY, generateRequestId());

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (isApiRoute(req)) {
    return apiMiddleware(req);
  }

  auth().protect();

  const { userId, orgId, sessionClaims } = auth();

  if (!userId) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }

  await get(WorkspaceService).ensureWorkspace({
    userId,
    orgId,
    sessionClaims,
  });

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
