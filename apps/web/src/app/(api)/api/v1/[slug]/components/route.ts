import { apiRoute } from '@/app/(api)/api/v1/_api/api-route';
import { ComponentsService } from '@/services/components.service';
import { get } from '@/services/service-factory';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest) =>
  apiRoute(request, async () => {
    const componentsService = await get(ComponentsService);
    const components = await componentsService.findAll();
    return components;
  });
