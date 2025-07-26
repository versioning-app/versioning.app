import { apiRoute } from '@/app/(api)/api/v1/_api/api-route';
import { ReleaseComponentService } from '@/services/release-component.service';
import { get } from '@/services/service-factory';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest) =>
  apiRoute(request, async () => {
    const releaseComponentsService = await get(ReleaseComponentService);
    const releaseComponents = await releaseComponentsService.findAll();
    return releaseComponents;
  });
