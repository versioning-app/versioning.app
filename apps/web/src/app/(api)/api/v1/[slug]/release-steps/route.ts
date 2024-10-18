import { apiRoute } from '@/app/(api)/api/v1/_api/api-route';
import { ReleaseStepService } from '@/services/release-steps.service';
import { get } from '@/services/service-factory';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest) =>
  apiRoute(request, async () => {
    const releaseSteps = await get(ReleaseStepService).findAll();
    return releaseSteps;
  });
