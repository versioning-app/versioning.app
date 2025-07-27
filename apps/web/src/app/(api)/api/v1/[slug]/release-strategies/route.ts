import { apiRoute } from '@/app/(api)/api/v1/_api/api-route';
import { ReleaseStrategiesService } from '@/services/release-strategies.service';
import { get } from '@/services/service-factory';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest) =>
  apiRoute(request, async () => {
    const releaseStrategiesService = await get(ReleaseStrategiesService);
    const releaseStrategies = await releaseStrategiesService.findAll();
    return releaseStrategies;
  });
