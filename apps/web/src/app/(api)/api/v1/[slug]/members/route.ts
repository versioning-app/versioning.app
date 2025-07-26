import { apiRoute } from '@/app/(api)/api/v1/_api/api-route';
import { MembersService } from '@/services/members.service';
import { get } from '@/services/service-factory';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest) =>
  apiRoute(request, async () => {
    const membersService = await get(MembersService);
    const members = await membersService.findAll();
    return members;
  });
