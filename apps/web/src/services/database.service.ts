import { db as AppDb } from '@/database/db';
import { BaseService } from '@/services/base.service';
import { type AppHeaders } from '@/types/headers';

export class DatabaseService extends BaseService {
  public constructor(headers: AppHeaders) {
    super(headers);
  }

  public getTables() {
    return Object.keys(AppDb._.schema!);
  }
}
