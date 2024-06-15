import { getLogger } from '@/lib/logger';
import { DefaultLogger, LogWriter } from 'drizzle-orm/logger';

class DrizzleLogger implements LogWriter {
  write(message: string) {
    getLogger({ name: 'db' }).debug(message);
  }
}

export const drizzleLogger = new DefaultLogger({ writer: new DrizzleLogger() });
