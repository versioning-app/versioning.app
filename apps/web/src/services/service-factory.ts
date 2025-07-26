import 'server-only';

import { BaseService } from '@/services/base.service';
import { type AppHeaders } from '@/types/headers';
import { headers } from 'next/headers';

export const getSync = <T extends BaseService>(
  service: new (headers: AppHeaders) => T,
  headers: AppHeaders,
): T => {
  return new service(headers);
};

export const get = async <T extends BaseService>(
  service: new (headers: AppHeaders) => T,
): Promise<T> => {
  const requestHeaders = await headers();
  return new service(requestHeaders);
};

export abstract class ServiceFactory {
  public static async get<T extends BaseService>(
    service: new (headers: AppHeaders) => T,
  ): Promise<T> {
    const requestHeaders = await headers();
    return new service(requestHeaders);
  }

  public static getSync<T extends BaseService>(
    service: new (headers: AppHeaders) => T,
    headers: AppHeaders,
  ): T {
    return new service(headers);
  }
}
