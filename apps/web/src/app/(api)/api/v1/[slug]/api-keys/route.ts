import { apiRoute } from '@/app/(api)/api/v1/_api/api-route';
import { ApiKeysService } from '@/services/api-keys.service';
import { get } from '@/services/service-factory';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest) =>
  apiRoute(request, async () => {
    const apiKeysService = await get(ApiKeysService);
    const apiKeys = await apiKeysService.findAll();
    return apiKeys;
  });
