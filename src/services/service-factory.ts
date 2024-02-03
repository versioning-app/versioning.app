import 'server-only';

import { BaseService } from '@/services/base.service';

export abstract class ServiceFactory {
  private static readonly services: Map<string, BaseService> = new Map();

  public static get<T extends BaseService>(service: new () => T): T {
    const serviceName = service.name;

    if (this.services.has(serviceName)) {
      return this.services.get(serviceName) as T;
    }

    const instance = new service();

    this.services.set(serviceName, instance);

    return instance;
  }
}
