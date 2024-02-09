import 'server-only';

import { BaseService } from '@/services/base.service';

export abstract class ServiceFactory {
  public static get<T extends BaseService>(service: new () => T): T {
    return new service();
  }
}
