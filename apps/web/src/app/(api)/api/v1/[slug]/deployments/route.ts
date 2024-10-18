import { apiRoute } from '@/app/(api)/api/v1/_api/api-route';
import { DeploymentsService } from '@/services/deployments.service';
import { get } from '@/services/service-factory';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest) =>
  apiRoute(request, async () => {
    const deployments = await get(DeploymentsService).findAll();
    return deployments;
  });
