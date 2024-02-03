import { serverLogger } from '@/lib/logger/server';

export abstract class BaseService {
  protected readonly logger;

  public constructor() {
    this.logger = serverLogger({ source: this.serviceName });
    this.initialise();
  }

  public get serviceName() {
    return this.constructor.name;
  }

  public initialise() {
    this.logger.debug('Service initialized');
  }
}
