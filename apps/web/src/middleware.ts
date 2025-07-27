import { StorageKeys } from '@/config/storage';
import { generateRequestId } from '@/lib/utils';
import { apiMiddleware } from '@/middleware/api';
import { get } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

import { PUBLIC_ROUTES } from '@/config/navigation';

const isPublicRoute = createRouteMatcher([
  ...Object.values(PUBLIC_ROUTES),
  '/',
  '/about',
  '/api/billing/webhooks/stripe',
]);

const isApiRoute = createRouteMatcher(['/api/v1/(.*)']);

const clerk = clerkMiddleware(async (auth, req, event) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  await auth.protect();

  const { userId, orgId, sessionClaims } = await auth();

  if (!userId) {
    return (await auth()).redirectToSignIn({ returnBackUrl: req.url });
  }

  const workspaceService = await get(WorkspaceService);
  await workspaceService.ensureWorkspace({
    userId,
    orgId,
    sessionClaims,
  });

  return NextResponse.next();
});

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // Generate request ID for each request
  request.headers.set(StorageKeys.REQUEST_ID_HEADER_KEY, generateRequestId());

  if (isApiRoute(request)) {
    return apiMiddleware(request);
  }

  return clerk(request, event);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
