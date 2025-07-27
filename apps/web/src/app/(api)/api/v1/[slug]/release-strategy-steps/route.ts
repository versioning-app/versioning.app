import { apiRoute } from '@/app/(api)/api/v1/_api/api-route';
import { ReleaseStrategyStepService } from '@/services/release-strategy-steps.service';
import { get } from '@/services/service-factory';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest) =>
  apiRoute(request, async () => {
    const releaseStrategyStepsService = await get(ReleaseStrategyStepService);
    const releaseStrategySteps = await releaseStrategyStepsService.findAll();
    return releaseStrategySteps;
  });
