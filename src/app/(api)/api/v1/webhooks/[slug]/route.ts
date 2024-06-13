import { apiRoute } from '@/app/(api)/api/v1/_api/api-route';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const POST = (request: NextRequest) =>
  apiRoute(request, async (request) => {
    const body = await request.json();

    const type = body?.type;

    if (!type || typeof type !== 'string') {
      throw new AppError(
        '$.type must be a string and is required',
        ErrorCodes.INVALID_REQUEST,
      );
    }

    switch (type.toUpperCase()) {
      case 'LIST':
        const releases = await get(ReleaseService).findAll();
        return releases;
      case 'PING':
        return { message: 'PONG' };
      default:
        throw new AppError(
          'Unsupported Type Provided',
          ErrorCodes.WEBHOOK_UNSUPPORTED_TYPE,
        );
    }
  });
