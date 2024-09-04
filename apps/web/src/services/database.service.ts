import { db as AppDb } from '@/database/db';
import { BaseService } from '@/services/base.service';

export class DatabaseService extends BaseService {
  public getTables() {
    return Object.keys(AppDb._.schema!);
  }
}
