import { db } from '@/database/db';
import { Lead, leads, NewLead } from '@/database/schema';
import { CrudRepository } from '@/services/repository/crud-repository.service';
import { eq } from 'drizzle-orm';

export class LeadService extends CrudRepository<typeof leads> {
  public constructor() {
    super(db, leads, 'id');
  }

  public async create(newLead: Pick<NewLead, 'email'>): Promise<Lead> {
    let existing: Lead | undefined;
    try {
      existing = await this.findOneBy(eq(leads.email, newLead.email));
      this.logger.info({ existing }, 'Found existing lead');
    } catch (error) {
      this.logger.debug('No existing lead found');
    }
    // Prevent creating duplicate leads by email - do not leak that this email is already in use
    if (existing) {
      // If we have previously opted them out, let's force them to be opted in now!
      if (existing.optedOut) {
        this.logger.info({ existing }, 'Re-enabling opted out lead');
        return await this.update(existing.id, { optedOut: false });
      }

      return existing;
    }

    return super.create(newLead);
  }
}
