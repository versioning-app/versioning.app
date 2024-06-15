import { serverLogger } from '@/lib/logger/server';

export abstract class BaseService {
  public constructor() {
    this.initialise();
  }

  public get serviceName() {
    return this.constructor.name;
  }

  public get logger() {
    return serverLogger({ name: this.serviceName });
  }

  public initialise() {
    this.logger.debug('Service initialized');
  }
}
