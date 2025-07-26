import { serverLoggerWithHeaders } from '@/lib/logger/server';
import { type AppHeaders } from '@/types/headers';

export abstract class BaseService {
  protected readonly headers: AppHeaders;

  public constructor(headers: AppHeaders) {
    this.headers = headers;
    this.initialise();
  }

  public get serviceName() {
    return this.constructor.name;
  }

  public get logger() {
    return serverLoggerWithHeaders(this.headers, { name: this.serviceName });
  }

  public initialise() {
    this.logger.trace('Service initialized');
  }
}
